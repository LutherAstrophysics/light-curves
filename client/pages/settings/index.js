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
              href="https://docs.google.com/spreadsheets/u/1/d/105MONNkKpdG18wPZL3lIoWaJ1gR3wJYgDS8HAmr1w8A/edit?usp=drive_web&ouid=106422460651926589811"
            >
              Primary data source.
            </a>
          </p>
          <p>
            Secondary data source
            <a
              href="https://docs.google.com/spreadsheets/d/105MONNkKpdG18wPZL3lIoWaJ1gR3wJYgDS8HAmr1w8A/edit#gid=0"
              className="text-blue-600 underline"
            ></a>
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
      </div>
    </Layout>
  );
}
