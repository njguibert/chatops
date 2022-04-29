module.exports = function (robot) {

const http = require('http')
var querystring = require('querystring');

robot.hear(/hola/i, (res) =>  {
      respuesta= "OPCIONES DISPONIBLES:\n\r";
      respuesta += "1 - Accion 1.\n\r";
      respuesta += "2 - Accion 2.\n\r";
      user = {stage: 0};

      name = res.message.user.name.toLowerCase();
      robot.brain.set(name, user);
      res.send(respuesta); 
})

function validar(id,fn){
  console.log("Validar:"+id)
  
  var post_data = {
//      'Name' : 'Jesus',
      'Chatid': id,
  }

  let dataEncoded = JSON.stringify(post_data);

    let req = http.request(
      {
      host: 'pc-uno.jesusguibert.local',
      port: '4000',
      path: '/api/validar',
      method: 'POST',
        headers: {
          'Content-Length': Buffer.byteLength(dataEncoded),
          'Content-Type': 'application/json',
        },
      },
      resFromAPI => {
        let body = "";
        resFromAPI.on('data', buffer => body += buffer);
        resFromAPI.on(
          'end',
          () =>{
            respuesta=JSON.parse(body);
            console.log(respuesta)
            //return respuesta;
            fn(respuesta)


          }
        );
      }
    );
    req.write(dataEncoded);
    req.end();

}
robot.hear(/(.*)/i, (res) =>  {
  validar(res.envelope.user.name,(obj)=>{
    if (obj.result){
        res.send(obj.msg);
    }else { //Usuario desconocido
      res.send("Usuario NO registrado, por favor proceda a registrarse");
    }
  })

})
}