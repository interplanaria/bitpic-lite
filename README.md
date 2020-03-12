# Bitpicbus

> Bitpic powered by Bitbus

![bitpic-bitbus](bitpic-bitbus.gif)

# What is Bitpic?

Bitpic is like [gravatar](https://en.wikipedia.org/wiki/Gravatar) but on Bitcoin. It lets you associate your [Paymail](https://bsvalias.org/) address with an on-chain image, thereby letting you take your avatar anywhere you go.

Learn more: [https://bitpic.network/about](https://bitpic.network/about)

# Install

## Step 1. Get planaria token

First go to [https://token.planaria.network/](https://token.planaria.network/) and get a token.

## Step 2. Add token to the app

Open the `.env` file and add your token there. Replace the `<ADD YOUR PLANARIA TOKEN HERE>` with your actual token:

```
TOKEN=<ADD YOUR PLANARIA TOKEN HERE>
```

## Step 3. Run

Just run your app!

```
npm install
node index
```

and open [http://localhost:3012](http://localhost:3012)

# How Bitpicbus works

1. **Bitbus:** Instead of crawling every transaction from Bitcoin in order to filter out Bitpic protocol transactions, Bitpicbus sends a crawl query to [Bitbus](https://bitbus.network), and it instantly synchronizes your local machine with whatever you asked for.
2. **BitFS:** Instead of crawling all avatar image files to your local server and serving from your local machine, bitpic-bitbus simply stores the [Bitfs URI](https://bitfs.network/about). Then it creates a key/value database of paymail addresses pointing to the correspondng BitFS URI.
3. **Web Server:** Then the app also sets up a web server at port 3012, which is served instantly. The important part is the routing. Using the key/value database populated in step 2, it redirects all `/u/<paymail>` addresses to the corresponding BitFS URI. This is handy because users can instantly verify the authenticity by looking up the corresponding transaction ID on a block explorer.

# Disclaimer

Bitpic-lite at this stage is meant as a demo and lacks certain features.

1. Currently bitpic-lite works only with images already mined on the blockchain. 
2. Also it doesn't do persistent crawling. [But this is not difficult to implement.](https://docs.bitbus.network/#/?id=_7-building-a-persistent-bitcoin-crawler)
3. In the future may implement Bitsocket and mempool support
