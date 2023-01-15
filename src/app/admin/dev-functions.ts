
import { Product } from "../models/product.model";
import { AdminService } from "../services/admin.service";
import { DevService } from "../services/dev.service";

var devMode = false;

var devService: DevService;
var adminService: AdminService;


function addProductQuantities(): void {
   fetch('assets/quantity.txt').then(response => response.text()).then(data => {
      var index = 0;
      var lines = data.split('\n');
      while (index < 350) {
         devService.modifyProductQuantities(lines[index]);
         index += 1;
      }
   });
};


function addUncategoriedProducts(): void {
   fetch('assets/ap_products.txt').then(response => response.text()).then(data => {
      let lines = data.split('\n');
      for (let i = 0; i < lines.length - 6; i++) {
         let partNumber = lines[i].replace(/(\r\n|\n|\r)/gm, "");
         let name = lines[i + 1].replace(/(\r\n|\n|\r)/gm, "");
         let brand = lines[i + 2].replace(/(\r\n|\n|\r)/gm, "");
         let price = lines[i + 3].replace(/(\r\n|\n|\r)/gm, "");
         let stock = parseInt(lines[i + 4].replace(/(\r\n|\n|\r)/gm, ""));
         let imgurls = lines[i + 5].replace(/(\r\n|\n|\r|[|]|')/gm, "").replace('[', '').replace(']', '').split(',');

         let description = lines[i + 6].replace(/(\r\n|\n|\r)/gm, "");

         i += 7;

         let product = new Product(partNumber, name, description, [], ['Nincs'], brand, price, [], [], stock, true, imgurls, []);
         if (devMode) {
            adminService.uploadData('products', Object.assign({}, product)).then(() => {
               console.log(product.partNumber + ' was uploaded!');
            });
         } else {
            console.log('dev mode disabled');
            return;
         }
      }
   });
}


async function uploadProductsFromTextFile(): Promise<void> {
   const url = 'assets/products.txt';
   const linesPerProduct: number = 13;
   const uploadLimit = 20000;
   const productsDone = 0;

   // Count number of lines in products.txt
   const response = await fetch(url);
   const content = await response.text();
   let numberOfLines = content.split('\n').length;

   let numberOfUploads: number = 0;
   fetch(url).then(response => response.text()).then(data => {

      // Start from 
      let index = productsDone * 13;
      let lines = data.split('\n');
      while (numberOfUploads < uploadLimit && index + 13 <= numberOfLines) {

         let partNumber = lines[index].replace(/(\r\n|\n|\r)/gm, "");
         let categories = lines[index + 1].replace(/(\r\n|\n|\r)/gm, "").split('*');
         let name = lines[index + 2].replace(/(\r\n|\n|\r)/gm, "");
         let description = lines[index + 3].replace(/(\r\n|\n|\r)/gm, "");
         let brand = lines[index + 4].replace(/(\r\n|\n|\r)/gm, "");
         let price = lines[index + 5].replace(/(\r\n|\n|\r)/gm, "");
         let imgurls = lines[index + 6].replace(/(\r\n|\n|\r|[|]|')/gm, "").replace('[', '').replace(']', '').split(',');
         let properties = lines[index + 7].replace(/(\r\n|\n|\r|[|]|')/gm, "").split(", ");

         for (let i = 0; i < properties.length; i++) {
            if (properties[i]) {
               properties[i] = properties[i].trim();
               if (properties[i].charAt(0) == '[') {
                  properties[i] = properties[i].substring(1, properties[i].length);
               }
               if (properties[i].charAt(properties[i].length - 1) == ']') {
                  properties[i] = properties[i].substring(0, properties[i].length - 1);
               }
               if (properties[i] == '*') {
                  properties.splice(i, 1);
                  i--;
               }
            }
         }

         for (let i = 0; i < imgurls.length; i++) {
            if (imgurls[i])
               imgurls[i] = imgurls[i].trim();
         }

         let stock = 0;
         let storages = lines[index + 8].replace(/(\r\n|\n|\r|[|]|')/gm, "").split(',');
         for (let i = 0; i < storages.length; i++) {
            let stockString = (storages[i].replace('[', '').replace(']', '').replace('>', '').split('/')[2]);
            if (stockString) {
               stock += parseInt(stockString.trim());
            } else {
               stock += 0;
            }
         }

         let factoryNumbers = lines[index + 9].replace(/(\r\n|\n|\r|[|]|')/gm, "").replace('[', '').replace(']', '').split(',');
         let returnable = lines[index + 10].replace(/(\r\n|\n|\r)/gm, "").toLowerCase() == 'true';
         let carIndexes = lines[index + 11].replace(/(\r\n|\n|\r)/gm, "").replace(' ', '').split(',');

         for (let i = 0; i < factoryNumbers.length; i++) {
            if (factoryNumbers[i])
               factoryNumbers[i] = factoryNumbers[i].trim();
         }

         for (let i = 0; i < carIndexes.length; i++) {
            if (carIndexes[i])
               carIndexes[i] = carIndexes[i].trim();
         }

         let newProduct = new Product(partNumber, name, description, categories, [], brand, price, properties, factoryNumbers, stock, returnable, imgurls, carIndexes);
         console.log(newProduct);
         this.devService.addProduct(Object.assign({}, newProduct)).then(() => {
            console.log(partNumber + ' was added');
         });

         index += linesPerProduct;
         numberOfUploads += 1;
      }
   });
}
