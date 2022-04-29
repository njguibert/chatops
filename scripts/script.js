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
  /*if (validar(res.envelope.user.name).result){
    res.send(obj.msg);
  }*/
  //console.log("Primero Valido a: "+res.envelope.user.name);


/*
  console.log("from: "+res.envelope.user.name);

  var post_data = {
      'Name' : 'Jesus',
      'Chatid': res.envelope.user.name,
  }
  let dataEncoded = JSON.stringify(post_data);

    let req = http.request(
      {
      host: 'pc-uno.jesusguibert.local',
      port: '4000',
      path: '/api/addCelular',
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
            if (respuesta.result && respuesta.msg=="Esperando Confirmacion"){
              respuesta= respuesta.msg+" \n\r";
              res.send(respuesta);
            }else if (respuesta.result && respuesta.msg=="Habilitado"){
              name = res.envelope.user.name;
              user= name ? robot.brain.get(name) : null;
              answer = (res.match[1].replace('chat-ops ', ''));
              console.log("answer"+answer);
              if (user){
                switch (user.stage){
                  case 1:
                    console.log("Estas en el estado 1 - Elegiste:"+res.match[1]);
                    if (answer==1) {
                      respuesta="OPCION SELECCIONADA: 1 - Ver balanzas\n\r";
                      res.send(respuesta);
                    }
                    else if(answer==2) {
                      respuesta="OPCION SELECCIONADA: 2 - Accion 2\n\r";
                      res.send(respuesta);
                    }
                  break;
                  case 2:
                    console.log("Estas en el estado 2");
                  break;        
                }
                
                user.stage += 1;
                if (user.stage>=2) {
                  user.stage=0;
                  robot.brain.remove(name);
                } 
                
              }
              else {
                respuesta= "Comando incorrecto!\n\r";
                res.send(respuesta); 
              }

            }
          }
        );
      }
    );
    req.write(dataEncoded);
    req.end();
*/
})

/*
robot.hear(/estado/i, (res) =>  {
     //console.log("from: "+res.envelope.user.name);
     //console.log("channel: "+res.message.room);
     if (res.envelope.user.name==res.message.room) res.send("Lamentablemente no te puedo ayudar, ya que el comando ingresado debe ser utilizado dentro del chat OPERACIONES_XXX");
     else {
      console.log("Perfecto, estas dentro de OPERACIONES_XXX");
      console.log("Remitente: "+res.envelope.user.name);
      console.log("Chatid: "+res.message.room);
      let url = "http://ocs.tata.com.uy/api/prtg/index.php?chatid="+res.message.room;  
      https.get(url,(response) => {
          let body = "";

          response.on("data", (chunk) => {
              body += chunk;
          });

          response.on("end", () => {
              try {
                  
                  if (body.includes("NO EXISTE EL chatid indicado")) {
                    //console.log("Respuesta true");
                    res.send("ERROR, chat desconocido");
                  }
                  else {
                    console.log("RESPUETA: "+body);  
                        let url = "http://ocs.tata.com.uy/api/prtg/index.php?local="+body;  
                        https.get(url,(response) => {
                            let body = "";

                            response.on("data", (chunk) => {
                                body += chunk;
                            });

                            response.on("end", () => {
                                try {
                                    
                                    if (body.includes("NO EXISTE EL groupid en prtg para el local indicado")) {
                                      //console.log("Respuesta true");
                                      res.send("El local "+res.match[1] + " aun no esta ingresado en el ops");
                                    }
                                    else {
                                    
                                    //console.log(body);
                                    let json = JSON.parse(body);
                                    respuesta= "";

                                      for (var sensor of json) 
                                      {
                                        //\u{2705} check de OK

                                        if (sensor.sensor=="Memoria") {
                                          if (sensor.lastvalue_raw>0) respuesta += "\u{2705}"+sensor.device +" : "+ sensor.sensor +" : "+ sensor.lastvalue_raw+"bytes"+"\n\r";
                                          else respuesta += "\u{274C}"+sensor.device +" : "+ sensor.sensor +" : "+ sensor.lastvalue_raw+"bytes"+"\n\r";
                                        }
                                        else {
                                          //respuesta += sensor.device +" : "+ sensor.sensor +" : "+ sensor.status+"\n\r";
                                          if (sensor.status=="Up") respuesta += "\u{2705}"+sensor.device +" : "+ sensor.sensor +" : "+ sensor.status+"\n\r";
                                          else respuesta += "\u{274C}"+sensor.device +" : "+ sensor.sensor +" : "+ sensor.status+"\n\r";                    
                                        }
                                      }
                                      res.send(respuesta);                
                                    }
                                    // do something with JSON
                                    

                                } catch (error) {
                                    console.error(error.message);
                                };
                            });

                        }).on("error", (error) => {
                            console.error(error.message);
                        });          
                  }
                  // do something with JSON
                  

              } catch (error) {
                  console.error(error.message);
              };
          });

      }).on("error", (error) => {
          console.error(error.message);
      });      
     }


})
  
robot.hear(/(hola)/i, (res) =>  {
    //res.send('parametrohl:'+ res.match[1])
    //if (res.match[1].toLowerCase().indexOf("locales") === -1){
        respuesta= "OPCIONES DISPONIBLES:\n\r"
        respuesta += "estado : Muestra el estado de las Balanzas.\n\r"
        //respuesta += "locales : Muestra Lista de Locales disponibles\n\r"
        //respuesta += "local XXX : Muestra estado de BALANZAS\n\r"
        respuesta += "jira XXX : Muestra los tickets de local XXX\n\r"
        res.send(respuesta);        
    //}
})

robot.hear(/locales/i, (res) =>  {
  respuesta= "Lista de locales DISPONIBLES:\n\r"
    
  locales.forEach(function(l){
        respuesta += l+"\n\r";
  });
    //respuesta += "locales : Muestra Lista de Locales disponibles\n\r"
    //respuesta += "/local XXX : Muestra estado de linea de cajas\n\r"
    res.send(respuesta);
})

robot.hear(/local (.*)/i,(res)=> {
    res.send('Estado de Balanzas:'+ res.match[1]);
    let url = "http://ocs.tata.com.uy/api/prtg/index.php?local="+res.match[1];  
    https.get(url,(response) => {
        let body = "";

        response.on("data", (chunk) => {
            body += chunk;
        });

        response.on("end", () => {
            try {
                
                if (body.includes("NO EXISTE EL groupid en prtg para el local indicado")) {
                  //console.log("Respuesta true");
                  res.send("El local "+res.match[1] + " aun no esta ingresado en el ops");
                }
                else {
                
                //console.log(body);
                let json = JSON.parse(body);
                respuesta= "";

                  for (var sensor of json) 
                  {
                    //\u{2705} check de OK

                    if (sensor.sensor=="Memoria") {
                      if (sensor.lastvalue_raw>0) respuesta += "\u{2705}"+sensor.device +" : "+ sensor.sensor +" : "+ sensor.lastvalue_raw+"bytes"+"\n\r";
                      else respuesta += "\u{274C}"+sensor.device +" : "+ sensor.sensor +" : "+ sensor.lastvalue_raw+"bytes"+"\n\r";
                    }
                    else {
                      //respuesta += sensor.device +" : "+ sensor.sensor +" : "+ sensor.status+"\n\r";
                      if (sensor.status=="Up") respuesta += "\u{2705}"+sensor.device +" : "+ sensor.sensor +" : "+ sensor.status+"\n\r";
                      else respuesta += "\u{274C}"+sensor.device +" : "+ sensor.sensor +" : "+ sensor.status+"\n\r";                    
                    }
                  }
                  res.send(respuesta);                
                }
                // do something with JSON
                

            } catch (error) {
                console.error(error.message);
            };
        });

    }).on("error", (error) => {
        console.error(error.message);
    });
  })
  */
}