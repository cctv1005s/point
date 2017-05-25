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
  yield this.render('index', {
    title: 'Hello World Koa!'
  });
});

router.get('/foo', function *(next) {
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
  this.body = {success:ture};
});

router.get('/q/:id',function*(next){
  yield this.render('index');
});

module.exports = router;
