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


router.get('/comment',function*(){
  var q = `select * from comment ORDER BY time DESC`;
  var r = yield p.query(q);
  this.body = {success:true,data:r};
});

router.post('/comment',function*(){
  var {name,content,mac} = this.request.body;
  var q = `INSERT INTO comment (name, mac, content, time) VALUES ('${name}', '${mac}', '${content}', '${new Date().getTime()}')`;
  yield p.query(q);
  this.body = {success:true};
});

module.exports = router;
