const fs = require("fs").promises; 
const readline = require("readline"); 
const yargs = require("yargs"); 

const argv = yargs
  .option("file", {
    alias: "f",
    type: "string",
    description: "Nombre del archivo JSON donde se guardarán los productos",
    default: "productos.json", 
  })
  .help()
  .argv;

const fileName = argv.file; 

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = (query) => {
    return new Promise((resolve) => {
      rl.question(query, (answer) => resolve(answer));
    });
  };
  
  const getProductData = async () => {
    const nombre = await askQuestion("Ingrese el nombre del producto: ");
    const precio = parseFloat(await askQuestion("Ingrese el precio del producto: "));
    const cantidad = parseInt(await askQuestion("Ingrese la cantidad de unidades: "), 10);
  
    return { nombre, precio, cantidad };
  };

  const saveProduct = async (product) => {
    try {
      let products = [];
  
      // Verificamos si el archivo existe
      try {
        const fileContent = await fs.readFile(fileName, "utf-8");
        products = JSON.parse(fileContent); // Convertimos el JSON en un array
      } catch (error) {
        // Si el error es porque el archivo no existe, simplemente seguimos con un array vacío
        if (error.code !== "ENOENT") throw error;
      }
  
      products.push(product); // Agregamos el nuevo producto
  
      // Guardamos el nuevo array en el archivo JSON
      await fs.writeFile(fileName, JSON.stringify(products, null, 2));
      console.log(`Producto guardado en ${fileName}`);
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  };
  const readProductsFile = async () => {
    try {
      const fileContent = await fs.readFile(fileName, "utf-8");
      const products = JSON.parse(fileContent);
  
      console.log("\nLista de productos:");
      console.table(products); // Muestra los productos en formato tabla
    } catch (error) {
      console.error("Error al leer el archivo:", error);
    }
  };
  
  const main = async () => {
    const product = await getProductData(); // Solicitamos los datos
    rl.close(); // Cerramos la interfaz de readline
    await saveProduct(product); // Guardamos el producto en el JSON
    await readProductsFile(); // Mostramos el contenido actualizado
  };
  
  main();
      
