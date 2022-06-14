import Layout from "components/Layout" 
import {fetcher} from "fetch"

export default function BadNights({badNights}){
    return (
        <Layout>
            <h3 className="text-2xl">Bad Nights List</h3>
            <p>These nights have been masked out when building lightcurves. To create/update bad nights data, make changes in the database.</p>
            <ul className="mt-4">
                {badNights.map(night => <li className="pt-2" key={night.id}>{night.date}</li>)}
            </ul>
        </Layout>
    )
}


export async function getStaticProps(){
  const badNightsList = await(fetcher(`/bad_nights?order=date.desc`))
  return {
    props: {
        badNights: badNightsList,
    },
  }
}
