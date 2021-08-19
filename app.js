const http = require("http");
const fs = require("fs");
const url = require("url");

///// Loading the templates
let tempOverview = fs.readFileSync(
  "./templates/template-overview.html",
  "utf-8"
);
let tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");
let tempProduct = fs.readFileSync("./templates/template-product.html", "utf-8");

///// product data loaded
let data = fs.readFileSync("./data.json", "utf-8");
const dataObj = JSON.parse(data);

// Replacing Templates
const replaceTemp = (temp, product) => {
  let output = temp.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOTORGANIC%}/g, "not-organic");

  return output;
};

/// Server created
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //overview page
  if (pathname === "/" || pathname === "/overview") {
    let output = tempOverview;
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const products = dataObj.map((el) => replaceTemp(tempCard, el));
    output = output.replace(/{%PRODUCTCARDS%}/g, products);

    res.end(output);

    ///// Product page
  } else if (pathname === "/product") {
    let output = dataObj[query.id];
    output = replaceTemp(tempProduct, output);

    res.writeHead(200, {
      "Content-type": "text/html",
      "my-own-header": "did it",
    });
    res.end(output);
  } else if (pathname === "/data") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    // Page not found case
    res.end("page not found");
  }
});

//// running the Server and listening for the request
server.listen(8000, "localhost", () => {
  console.log("done");
});
