const fs = require('fs');
const url = require('url');
const http = require('http');
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

// fs.readFile(`./txt/start.txt`, "utf-8", (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//         console.log(data2);
//         fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//             console.log(data3);
//             fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//                 console.log('Your File has been written 😂');
//             });
//         });
//     });
// });

// const tempOverview = fs.readFileSync(`${__dirname}/template/overview`, 'utf-8', (err, data) => {});

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    const cardsHTML = dataObj
      .map((ele) => replaceTemplate(tempCard, ele))
      .join(' ');

    res.end(tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML));
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const product = dataObj[query.id];
    res.end(replaceTemplate(tempProduct, product));
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'my-own-header': 'This Is Jayant',
    });
    res.end('<h1>Page Not Found</h1>');
  }
});

server.listen(8000, 'localhost', () => {
  console.log('Listening from the server ... http://localhost:8000/');
});
