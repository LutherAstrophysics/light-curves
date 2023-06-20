import Layout from "components/Layout";

export default function Index() {
    return (
        <Layout>
            <div className="flex flex-col gap-y-4">
                <div>
                    <h2 className="text-2xl">Stars Data</h2>
                    <p>
                        <a
                            className="text-blue-600 underline"
                            href="https://docs.google.com/spreadsheets/u/1/d/1Vv8_6IX_y6Wg6FuHJpgUVYnhiZ4dBOq8535wMoCXYP4/edit?usp=drive_web&ouid=106422460651926589811"
                        >
                            Primary data source.
                        </a>
                    </p>
                    <p>
                        <a
                            className="text-blue-600 underline"
                            href="https://docs.google.com/spreadsheets/d/10EA2VOdk0EbbgxER6rFxY3sth-Oy83ngUTbFBxxtoZA/edit#gid=0"
                        >
                            Secondary Data source
                        </a>
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl">Bad nights</h2>
                    <p className="mt-2">
                        <a
                            className="text-blue-600 underline"
                            href="https://docs.google.com/spreadsheets/d/12JxtFGkQ5VKZORdVcNtsWhbvh2jhjG5fNGQHv8DUr1g/edit#gid=0"
                        >
                            Primary data source.
                        </a>
                    </p>
                    <p>
                        <a
                            className="text-blue-600 underline"
                            href="https://docs.google.com/spreadsheets/d/105MONNkKpdG18wPZL3lIoWaJ1gR3wJYgDS8HAmr1w8A/edit#gid=0"
                        >
                            Secondary data source
                        </a>
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl">Color Data</h2>
                    <a
                        className="text-blue-600 underline"
                        href="https://docs.google.com/spreadsheets/d/1x6y4kq-xX1-9GGzLm4rDG_U56dtrTtrXsF9BftMt9Jg/edit#gid=0"
                    >
                        Source.
                    </a>
                </div>
                <div>
                    <h2 className="text-2xl">How to update ?</h2>
                    <ol className="list-decimal list-inside">
                        <li>Update the data in google sheets linked above.</li>
                        <li>Open terminal app in the server </li>
                        <li>
                            Type <pre className="inline">update-m23-db</pre> and
                            press enter. Follow instructions there.
                        </li>
                        <li>
                            Either restart the computer or type <pre> restart-frontend</pre> to rebuild
                            the frontend page with updated data. If you choose the latter, you
                            should not close the process and do other works you may have in a new terminal.
                        </li>
                    </ol>
                </div>
            </div>
        </Layout>
    );
}
