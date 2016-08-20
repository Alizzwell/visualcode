var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

var examples = [{
  id: 1,
  title: "Bubble Sort",
  code: "#include <stdio.h>\n\nint main() {\n\tprintf(\"Bubble Sort\");\n\treturn 0;\n}",
  input: "",
  designer: {}
},
{
  id: 2,
  title: "DFS Searching",
  code: "#include <stdio.h>\n\nint main() {\n\tprintf(\"DFS Searching\");\n\treturn 0;\n}",
  input: "",
  designer: {}
},
{
  id: 3,
  title: "BFS Searching",
  code: "#include <stdio.h>\n\nint main() {\n\tprintf(\"BFS Searching\");\n\treturn 0;\n}",
  input: "",
  designer: {}
}];

router.get('/api/examples', function (req, res) {
  res.json(examples.map(function (item) {
    return {
      id: item.id,
      title: item.title
    };
  }));
});

router.get('/api/examples/:id', function (req, res) {
  res.json(examples.find(function (item) {
    return item.id == req.params.id;
  }));
});

module.exports = router;
