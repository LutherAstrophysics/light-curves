import { Error, Loading } from "components/UI";

export function withData(Component, data, error) {
    if (error) return <Error />;
    if (!data) return <Loading />;
    return <Component data={data} />;
}
