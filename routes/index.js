var express = require('express');
var router = express.Router();
const { resolve } = require('path');

const absolutePath = resolve('./public/files/swagger-output.json');

const emailRegex = '^[a-zA-Z0-9._%+]+@[a-zA-Z0-9.]+\\.[a-zA-Z]{2,4}$';

/* GET home page. */
router.get('/', function (req, res, next) {
   res.render('index', { title: 'Express' });
});

router.get('/swagger', function (req, res, next) {
   res.sendFile(absolutePath);
});

let tasks = [
   {
      id: 1,
      name: 'Task 1',
      description: 'Description 1',
   },
   {
      id: 2,
      name: 'Task 2',
      description: 'Description 2',
   },
   {
      id: 3,
      name: 'Task 3',
      description: 'Description 3',
   },
];

router.use(function (req, res, next) {
   const task = req.body;

   const pathsRequieringBody = ['/tasks', '/tasks/:id'];

   pathsRequieringBody.forEach((path) => {
      if (req.path === path && !task) {
         res.status(406).send(JSON.stringify({ error: 'Body is missing!' }));
         return;
      }
   });

   next();
});

router.use(function (req, res, next) {
   let cookies = req.cookies;

   if (req.path === '/login') {
      next();
      return;
   }

   if (cookies["I'm a Cookie"]) {
      next();
   } else {
      res.status(403).send(
         JSON.stringify({
            error: 'There is no cookie, you have to login first!',
         }),
      );
   }
});

function isBodyValid(res, body) {
   if (!body.id || !body.name || !body.description) {
      res.status(400).send('Invaild body!');
      return false;
   }

   return true;
}

router.get('/tasks', function (req, res, next) {
   res.status(200).send(tasks);
});

router.post('/tasks', function (req, res, next) {
   const task = req.body;

   if (!isBodyValid(res, task)) return;

   tasks.push(task);
   res.status(201).send(task);
});

router.get('/tasks/:id', function (req, res, next) {
   const id = parseInt(req.params.id);
   const task = tasks.find((task) => task.id === id);

   if (!task) {
      res.status(404).send('Task not found');
      return;
   }

   res.status(200).send(task);
});

router.put('/tasks/:id', function (req, res, next) {
   const id = parseInt(req.params.id);
   const index = tasks.indexOf(tasks.filter((task) => task.id === id)[0]);

   if (index === -1) {
      res.status(404).send('Task not found');
      return;
   }

   if (!isBodyValid(res, req.body)) return;

   const newTask = req.body;
   tasks = tasks.map((task) => (task.id === id ? newTask : task));

   res.status(204).send(newTask);
});

router.delete('/tasks/:id', function (req, res, next) {
   const id = parseInt(req.params.id);
   const index = tasks.indexOf(tasks.filter((task) => task.id === id)[0]);
   const task = tasks.find((task) => task.id === id);

   if (index === -1) {
      res.status(404).send('Task not found');
      return;
   }

   tasks.splice(index, 1);
   res.status(204).send(task);
});

/* Cookie / Login */

router.post('/login', function (req, res, next) {
   let user = req.body;

   if (user.email.match(emailRegex) && user.password == 'm295') {
      res.cookie("I'm a Cookie", {
         password: user.password,
         email: user.email,
         httpOnly: true,
      });

      res.status(200).send('Cookie set');
   } else {
      res.status(401).send('Wrong credentials');
   }
});

router.delete('/logout', function (req, res, next) {
   let cookies = req.cookies;

   if (cookies["I'm a Cookie"]) {
      res.clearCookie("I'm a Cookie");
      res.status(204).send('Cookie deleted');
   } else {
      res.status(401).send('No Cookie');
   }
});

router.get('/verify', function (req, res, next) {
   let cookies = req.cookies;

   if (cookies["I'm a Cookie"]) {
      res.status(200).send(cookies["I'm a Cookie"]);
   } else {
      res.status(401).send('No Cookie');
   }
});

module.exports = router;
