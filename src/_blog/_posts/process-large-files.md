---
post_title: How to Process Large Files with Node.js
post_author: Success Ologunsua
post_author_avatar: success.png
date: '2022-06-03'
post_image: process-large-files.png
post_excerpt: Processing large files takes a lot of memory and can severely impact the performance of your Node.js application. Using Node.js streams, you can optimize how large files are handled
post_slug: process-large-files-nodejs-streams
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'new-express-5-features',
    'promise-performance-node',
    'everyauth',
  ]
---

Have you ever run into problems while trying to process huge files in your Node.js application? Large files can overtax your available memory and slow down your workflow to a crawl. Rather than splitting up the files, dealing with multiple errors, or suffering through a time lag, you can try using streams instead.

This tutorial will demonstrate how to read, parse, and output large files using Node.js streams.

## What Are Node.js Streams?

The Node.js stream feature makes it possible to process large data continuously in smaller chunks without keeping it all in memory. In other words, you can use streams to read from or write to a source continuously instead of using the traditional method of processing all of it at once.

One benefit of using streams is that it saves time, since you don’t have to wait for all the data to load before you start processing. This also makes the process less memory-intensive.

Some of the use cases of Node.js streams include:

- Reading a file that’s larger than the free memory space, because it’s broken into smaller chunks and processed by streams. For example, a browser processes videos from streaming platforms like Netflix in small chunks, making it possible to watch videos immediately without having to download them all at once.
- Reading large log files and writing selected parts directly to another file without downloading the source file. For example, you can go through traffic records spanning multiple years to extract the busiest day in a given year and save that data to a new file.

## Using Streams in Node.js

For this tutorial, you’re going to use Node.js streams to process a large CSV file.

### Prerequisites

To follow this tutorial, you will need:
- Basic knowledge of Node.js
- Node.js installed on your local environment
- Basic knowledge of the Node.js `fs` module
- [A large sample CSV file](https://www.stats.govt.nz/assets/Uploads/New-Zealand-business-demography-statistics/New-Zealand-business-demography-statistics-At-February-2021/Download-data/Geographic-units-by-industry-and-statistical-area-2000-2021-descending-order-CSV.zip)

For sample data, you’ll be using New Zealand business statistics from [Stats NZ Tatauranga Aotearoa](https://stats.govt.nz/large-datasets/csv-files-for-download/). The data set linked above contains geographical units by industry and statistical area from the years 2000 to 2021.

Once you’ve downloaded the zipped file, extract the CSV file and rename it to `business_data.csv`.

You’re going to read this file, parse the data, and output the parsed data in a separate output file using Node.js streams.

### Step 1: Creating the Node.js App

First, set up your project. Create a folder called `node-streams` to contain all the files you need.

In your terminal, run this code:

```
mkdir node-streams
```

Change your working directory to the new folder:

```
cd node-streams
```

Next, create and open a file called `index.js`:

```
touch index.js
```

Make sure your CSV file is saved in your working directory. If it’s not, you can move the CSV file from its saved location into the `node-streams` folder using this command:

```
mv business_data.csv Desktop/node-streams // in this case, the node-streams folder is directly inside the Desktop folder
```

### Step 2: Installing Dependencies

Next, install the `fs` and `readline` packages. The `fs` module will give you access to the read and write functions of the file, while the `readline` module lets you receive data from a readable stream one line at a time.

Use the command below to install the packages:

```
npm i fs readline
```

### Step 3: Reading the File

The `fs` module has a `createReadStream()` function that lets you read a file from the filesystem and print it to the terminal. When called, this function emits the `data` event, releasing a piece of data that can be processed with a callback or displayed to the terminal.

In the `index.js` file you created earlier, copy and paste the code below:

```js
import fs from 'fs';

function read() {
   let data = '';
   const readStream = fs.createReadStream('business_data.csv', 'utf-8');
   readStream.on('error', (error) => console.log(error.message));
   readStream.on('data', (chunk) => data += chunk);
   readStream.on('end', () => console.log('Reading complete'));
};

read();
```

In the above code snippet, you import the `fs` module and create a function that reads the file. In the `read()` function, you initialize an empty variable called `data`, then create a readable stream with the `createReadStream()` function. This latter function takes two parameters: the file path of the file to be read and the encoding type, which ensures the data is returned in human-readable format instead of the default buffer type.

The lines that follow handle the necessary events. The `error` event checks for errors and prints to the terminal if there are any (for example, if a wrong file path is sent), the `data` event adds data chunks to the `data` variable, and the `end` event lets you know when the stream is completed.

Run the code with this command on the terminal:

```
node index
```

If you check the terminal, you’ll see that the reading has been completed:

```
Output

Reading complete
```

### Step 4: Parsing the File

Next you’ll parse the data, or transform it into a different format, so that you can extract specific information on geographic unit counts in certain years.

Import the `readline` module at the top of the file:

```js
import fs from 'fs';
import readline from 'readline'
```

Overhaul the `read()` function as shown below:

```js
function readAndParse() {
   let counter = 0;
   const readStream = fs.createReadStream('business_data.csv', 'utf-8');
   let rl = readline.createInterface({input: readStream})
   rl.on('line', (line) => {
       const year = line.split(',')[2];
       const geo_count = line.split(',')[3];
       if (year === '2020' && geo_count >200) {
           counter++
       }
   });
   rl.on('error', (error) => console.log(error.message));
   rl.on('close', () => {
       console.log(`About ${counter} areas have geographic units of over 200 units in 2020`)
       console.log('Data parsing completed');
   })
}
readAndParse();
```

In the above code, you use the `readline` module to create an interface that enables you to read the standard input from your terminal line by line. Then you bind three event listeners to the interface. The `line` event is emitted each time the input stream receives an input with a callback function. In the callback you extract the year and geographic unit count, and increment the counter variable each time it encounters a line record from 2020 with a geographic unit count greater than 200.

The `error` event outputs the error message in case there is one. Finally, the `close` event displays the result of the `line` event callback in the terminal.

Run the code with the `node index` command. You should see something like this:

```
Output

About 5424 areas have geographic units of over 200 units in 2020
Data parsing completed
```

### Step 5: Outputting the Parsed Data

There are several ways to output your parsed data. You used one option earlier when you logged some parts of the data in the terminal. A better option, though, is to save your output in a separate file. This way, the data is available even after you’ve closed your terminal.

The Node.js `fs` module has a method called `pipe()` that lets you write the result of a read stream directly into another file. All you need to do is initialize the read stream and write stream, then use the `pipe()` method to save the result of the read stream into the output file. Just think of it like a pipe passing water from one source to another—you use `pipe()` to pass data from an input stream to an output stream.

To implement this method, copy the following code and paste it into your `index.js` file below the `readAndParse()` function:

```js
function outputParsedData() {
   const readStream = fs.createReadStream('business_data.csv')
   const writeStream = fs.createWriteStream('business_data_output.csv')
   readStream.pipe(writeStream);
   writeStream.on('finish', () => console.log('Copying completed'))
}
outputParsedData();
```

In this code, you use `createReadStream()` to create a readable stream, then `createWriteStream()` to create a writable stream. You use the `pipe()` function to pass data from the readable stream to the writable stream. Then you listen to the `finish` event, which indicates when the event is complete. Since the data transfer is direct, you don’t have to handle events on both streams.

Run the code again with the `node index` command. You should see something like this:

```
Output

Copying completed
```

You’ll see that a `business_data_output.csv` file has been created and that the data in your input file (`business_data.csv`) is replicated in it.

## Conclusion

Node.js streams are an effective way of handling data in input/output operations. In this tutorial, you learned how to read large files with just the source file path, how to parse the streamed data, and how to output the data. You’ve seen firsthand how streams can be used to build large-scale, high-performing applications.

Note that using streams in your application can increase its complexity, so be sure that your application really needs this functionality before implementing Node.js streams.​​

If you’d like to do even more with your application, try [Fusebit](https://fusebit.io/). The developer-friendly integration platform allows you to easily add third-party integrations to your project, and its integration logic runs in a Node.js environment. You can use the SaaS cloud-native platform for seamless editing, debugging, deployment, and scaling.

Follow [@fusebitio](https://twitter.com/fusebitio) on Twitter for more developer content.
