import Head from 'next/head'
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Page.module.scss'

import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";

export default function Home({ home, products }) {
  const { heroTitle, heroText, heroBackground, heroLink } = home;
  return (
    <Layout>
      <Head>
        <title>Space Jelly Gear</title>
        <meta name="description" content="Get your Space Jelly gear!" />
      </Head>

      <Container>
        <h1 className="sr-only">Space Jelly Gear</h1>

        <div className={styles.hero}>
          <Link href={heroLink}>
            <a>
              <div className={styles.heroContent}>
                <h2>{heroTitle}</h2>
                <p>{heroText}</p>
              </div>
              <Image className={styles.heroImage} src={heroBackground.url} alt="" width={heroBackground.width} height={heroBackground.height} />
            </a>
          </Link>
        </div>

        <h2 className={styles.heading}>Featured Gear</h2>

        <ul className={styles.products}>
          {products.slice(0, 4).map(product => {
            return (
              <li key={product.slug}>
                <Link href={`/products/${product.slug}`}>
                  <a>
                    <div className={styles.productImage}>
                      <Image width={product.image.width} height={product.image.height} src={product.image.url} alt="" />
                    </div>
                    <h3 className={styles.productTitle}>
                      {product.name}
                    </h3>
                    <p className={styles.productPrice}>
                      ${product.price}
                    </p>
                  </a>
                </Link>
                <p>
                  <Button className="snipcart-add-item"
                    data-item-id={product.id}
                    data-item-price={product.price}
                    data-item-url={`/products/${product.slug}`}
                    data-item-image={product.image.url}
                    data-item-name={product.name}>
                    Add to Cart
                  </Button>
                </p>
              </li>
            )
          })}
        </ul>
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {

  const client = new ApolloClient({
    uri: 'https://api-us-west-2.graphcms.com/v2/cl1wywy4e0njk01yx0lf5ebto/master',
    cache: new InMemoryCache()
  });

  const { data } = await client.query({
    query: gql`
      query PageHome {
        page(where: {slug: "home"}) {
          id
          name
          heroText
          heroTitle
          heroLink
          heroBackground
        }
        products(where: {categories_some: {slug: "featured"}}) {
          id
          image
          name
          price
          slug
        }
      }`
  });
  console.log("result ", data.page);
  return {
    props: {
      home: data.page,
      products: data.products
    }, // will be passed to the page component as props
  }
}
