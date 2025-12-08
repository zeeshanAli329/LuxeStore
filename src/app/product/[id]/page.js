import DetailsPage from "../../productsSection/DetailsPage";

export default async function Page({ params }) {
    const { id } = await params;
    return <DetailsPage id={id} />;
}
