let express = require('express');
let app = express();
let mongo = require('mongodb');
let fs = require('fs');

let sanitizeHtml = require('sanitize-html');
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}));

function passwordProtecte(req, res, next){
  res.set("WWW-Authenticate", 'Basic realm="Simple To-Do-App"')
  console.log(req.headers.authorization)
  if(req.headers.authorization == "Basic T3Vzc2FtYTpPdXNzYW1h"){
    next()
  }
  else{
    res.status(401).send("Authentification Obligée !")
  }
}

let db
let port = process.env.PORT 
if(port == null || port == ""){
  port = 9001;
}
let connectionString = 'mongodb+srv://ToDoAppUser:LoJy8Ar7LWxzDhns@cluster0-ljs3d.mongodb.net/TodoApp?retryWrites=true&w=majority';

mongo.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err,client){
if(err){
    console.log('Erreur dans la base de données');
}else 
    db = client.db();
    console.log('Data base connected successfully !')
    app.listen(port);
});

app.use(express.json())

// app.use(passwordProtected);


  app.get('/',passwordProtecte,function(req, res){
  db.collection('items').find().toArray( (err, items) =>{
    // items contain values that I added to my table
    // if(err){
    //   console.log('error database')
    // }
    // else 
    // fs.readFile('To-Do.ejs', function(err, data){
    //   if(err){
    //     throw err;
    //   }
    //   else 
    //   res.writeHead(200, {'content-type': 'text/html'})
    //   res.write(data);
    //   res.end();
    // })
    if(err){
      console.log("Erreur !!");
    }else 
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
      
    </head>
    <body>
    <br /><br /><br /><br /><br /><hr />
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">

          <form id='form' action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input autofocus autocomplete="off" id='create-item' name="item" class="form-control mr-3" type="text" style="flex: 1;" required>
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id='listGroup' class="list-group pb-5">
        ${items.map( (item) =>{
          return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
          <span class="item-text">${item.text}</span>
          <div>
            <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
          </div>
        </li>`;
        }).join(' ')}
          

        </ul>
        
      </div>
      
    </body>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="/browser.js"></script>
    </html>`)
    //console.log(items);

  })

})

app.post('/create-item',passwordProtecte, (req, res) => {
  let o =  req.body.item
  let safeText = sanitizeHtml(o, {allowedTags: [], allowedAttributes: {}}) 
    db.collection('items').insertOne({text: safeText}, (err) =>{
      if(err){
        throw err;
      }
      else
      res.redirect('/')
    })
  })

  app.post('/update-item', passwordProtecte, (req, res) => {
      db.collection('items').findOneAndUpdate({_id: new mongo.ObjectId(req.body.id)}, {$set: {text: req.body.text}}, () =>{
        res.send("success")
       console.log('Modification a été bien faite !')
      })
    })

    app.post('/delete-item', (req, res) =>{
      db.collection('items').deleteOne({_id: new mongo.ObjectId(req.body.id)}, () =>{
        res.send("Success")
        console.log("Suppression terminée !")
      })
    })
  

