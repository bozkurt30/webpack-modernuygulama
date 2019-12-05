//bu ayar dosyası
/*
module.exports ={
    entry:'./index.js',//kodlarımı buraya yazacam
    output:{//ancak webpack bnm için yeni bir js dosyası oluşturacak.Onu da output içine
        //outpu 2 tane parametresi oalcak
        path: __dirname,//bu dosya nerde yer alacak. webpack config dos. bulunduğu klasörü temsil eder.
        filename:'bundle.js',//Oluşacak olan dos. adı.(isteğinz ismş verebilrz). Bir bundle işlemi(paketleme)
    },
    mode:'development'//geliştirme aşamasnda
}
*/
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
 const path = require('path');

 module.exports={
     entry:['babel-polyfill','./src/js/index.js'],
     output:{
         path: path.resolve(__dirname,'dist'),
         filename:'js/bundle.js'//distin içndeki js içine atacak
     },
     devServer:{
         contentBase:'./src'
     },
     plugins:[//buna benze çok fazla plugin var...
         new HtmlWebpackPlugin({
             filename:'index.html',
             template:'./src/index.html'
         })
     ],
     module: {
        rules: [
          {
              test:[/\.js$/,/\.vue$/], //.js ile biten dosyları tarar
              exclude: /node_modules/, //iiçnde nodemodule olanları çıkar. node_module içndekiler katılmıyor bu işlem içine
              loader:["babel-loader",'vue-loader'],//paket ismi
          }
        ]
      },
      plugins: [
        // make sure to include the plugin!
        new VueLoaderPlugin()
      ]
 }