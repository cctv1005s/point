var router = require('koa-router')();
var wrapper = require('co-mysql'),
  mysql = require('mysql'),
  co = require('co');

var options = {
    'host':'www.jyonline.cc',
    'port':'6700',
    'user':'root',
    'password':'password',
    'database':'point'
};

var pool = mysql.createPool(options);
var p = wrapper(pool);

router.get('/', function *(next) {
  yield p.query(`UPDATE student SET state='0'`);
  yield this.render('index', {
    title: '点名系统Demo'
  });
});


router.get('/students',function*(next){
  var r = yield p.query('SELECT * FROM `student` LIMIT 0, 1000');
  this.body = {students:r};
});

router.get('/point/:id',function*(next){
  var id = this.params.id;
  yield p.query(`UPDATE student SET state='1' WHERE (id='${id}')`);
  this.body = {success:true};
});

router.get('/q/:id',function*(next){
  var id = this.params.id;
  var r = yield p.query(`SELECT * FROM student WHERE id = '${id}'`);
  yield this.render('point',{
    title:r[0].name + '的点名界面',
    user:r[0]
  });
});

module.exports = router;
