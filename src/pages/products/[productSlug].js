import Head from 'next/head'

import Layout from '@components/Layout';
import Header from '@components/Header';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Product.module.scss'

import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";

const client = new ApolloClient({
  uri: 'https://api-us-west-2.graphcms.com/v2/cl1wywy4e0njk01yx0lf5ebto/master',
  cache: new InMemoryCache()
});


export default function Product({ product }) {
  return (
    <Layout>
      <Head>
        <title>{product.name}</title>
        <meta name="description" content={`Find ${product.name} at Space Gelly Gear`} />
      </Head>

      <Container>
        <div className={styles.productWrapper}>
          <div className={styles.productImage}>
            <img width={product.image.width} height={product.image.height} src={product.image.url} alt="" />
          </div>
          <div className={styles.productContent}>
            <h1>{product.name}</h1>
            <div className={styles.productDescription} dangerouslySetInnerHTML={{
              __html: product.description?.html
            }} />
            <p className={styles.productPrice}>
              ${product.price}
            </p>
            <p className={styles.productBuy}>
              <Button>
                Add to Cart
              </Button>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const { data } = await client.query({
    query: gql`
      query MyQuery($slug: String) {
        product(where: {slug: $slug}) {
          id
          image
          name
          price
          slug
          description {
            html
          }
        }
      }`,
    variables: {
      slug: params.productSlug,
    }
  });
  console.log("product data ", data);
  return {
    props: {
      product: data.product,
    }
  }
}
export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query PageProducts {
        products {
          id
          name
          slug
          price
          image
        }
      }`
  });
  console.log("paths ", data);
  const paths = data.products.map(product => {
    return {
      params: {
        productSlug: product.slug
      }
    }
  })
  return {
    paths,
    fallback: false
  }
}