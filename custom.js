//recibir el formulario
const formPreguntaChat=document.getElementById('form-pregunta-chat');
const OPENAI_API_KEY= "TU_API_KEY";

if(formPreguntaChat){

    
    formPreguntaChat.addEventListener('submit',async (e) =>{

        //evitar que se recargue la pagina
        e.preventDefault();

        //sustituir el boton de enviar por "buscando..."
        document.getElementById('btn-pregunta-chat').value="Buscando...";
        
        //recibir el campo de la pregunta
        let pregunta=document.getElementById('campo-pregunta').value;
        //console.log(pregunta);
        
        //enviar el texto de la pregunta a la pagina html
        document.getElementById('pregunta').innerHTML=pregunta;//innerhtml para mostrar el texto en el html


        //peticion a chatgpt
        await fetch("https://api.openai.com/v1/completions", {
            //metodo para enviar datos
            method: "POST",

            //datos enviados en la peticion
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer "+OPENAI_API_KEY,
            },
            //Enviar los datos
            body: JSON.stringify({
                model: "text-davinci-003", //modelo de IA
                prompt: pregunta, //Texto de entrada
                max_tokens: 2048, //tamaño de la respuesta
                temperature: 0.5, //criatividad de la respuesta
            }),
        })
        //acessar el then cuando obtenga la respuesta
        .then((respuesta)=>respuesta.json())
        .then((datos)=>{
            //console.log(datos);
            //console.log(datos.choices[0].text);

            //enviar el texto de la respuesta a la pagina html
            document.getElementById('respuesta').innerHTML=datos.choices[0].text;
        })
        //retorna catch
        .catch(()=>{
            //enviar el texto de la respuesta a la pagina html
            document.getElementById('respuesta').innerHTML="SIN RESPUESTA";
        });

            //sustituir el boton de enviar por "ENVIAR"
            document.getElementById('btn-pregunta-chat').value="Enviar";
    });
}
