import clientPromise from "../lib/mongodb";

export default function products({ products }) {
  return (
    <div>
      <h1>Yato.am products</h1>
      <ul>
        {products.map((product: any) => (
          <li>
            <h3>{product.Name}</h3>
            <p>{product.SKU}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("yatoam");

    const products = await db
      .collection("products")
      .find({})
      .limit(5000)
      .toArray();

    return {
      props: { products: JSON.parse(JSON.stringify(products)) },
    };
  } catch (e) {
    console.error(e);
  }
}
