#!/usr/bin/env node

var path = require('path');
var express = require('express');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer();
var app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.all('/api/*', function (req, res) {
  proxy.web(req, res, {
      target: 'http://localhost:2337'
  });
});

app.listen(8080);
