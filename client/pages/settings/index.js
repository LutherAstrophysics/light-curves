import Layout from "components/Layout";

export default function Index() {
  return (
    <Layout>
      <p>
        We are getting stars data from{" "}
        <a
          className="text-blue-600 underline"
          href="https://docs.google.com/spreadsheets/u/1/d/1Vv8_6IX_y6Wg6FuHJpgUVYnhiZ4dBOq8535wMoCXYP4/edit?usp=drive_web&ouid=106422460651926589811"
        >
          here
        </a>
        . For any particular star, current value in database is visible at{" "}
        <span className="text-blue-400">
          http://10.30.5.4:8000/star_101_4px
        </span>{" "}
        replace 101 with the star number you want!
      </p>
      <p className="mt-2">
        We are bad nights list from{" "}
        <a
          className="text-blue-600 underline"
          href="https://docs.google.com/spreadsheets/u/1/d/105MONNkKpdG18wPZL3lIoWaJ1gR3wJYgDS8HAmr1w8A/edit?usp=drive_web&ouid=106422460651926589811"
        >
          here.
        </a>
        Current value of the bad nights in the database is visible at{" "}
        <a
          href="http://10.30.5.4:8000/bad_nights"
          className="text-blue-600 underline"
        >
          http://10.30.5.4:8000/bad_nights
        </a>
      </p>
      <p className="mt-2">
        We are getting colors data from{" "}
        <a
          className="text-blue-600 underline"
          href="https://docs.google.com/spreadsheets/d/1x6y4kq-xX1-9GGzLm4rDG_U56dtrTtrXsF9BftMt9Jg/edit#gid=0"
        >
          here.
        </a>
        Current value of the colors data in the database can be found at{" "}
        <a
          href="http://10.30.5.4:8000/color"
          className="text-blue-600 underline"
        >
          http://10.30.5.4:8000/color
        </a>
      </p>
      <p className="mt-8">
        If any data in the source (google spreadsheet) is out of sync with the
        data in the database, it must be synced by running import script of the
        respective kind. These scripts are located in{" "}
        <a
          href="https://github.com/LutherAstrophysics/light-curves/tree/main/backend/scripts"
          className="text-blue-600 underline"
        >
          https://github.com/LutherAstrophysics/light-curves/tree/main/backend/scripts
        </a>
      </p>
    </Layout>
  );
}
