export function fetcher(key, ...rest) {
  const hostname = getHostName();
  const fetchUrl = `${hostname}${key}`;

  return fetch(fetchUrl, ...rest).then((res) =>
    res.status == 200 ? res.json() : []
  );
}

export function fetcherPost(key, postBody) {
  const hostname = getHostName();
  const fetchUrl = `${hostname}${key}`;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  return fetch(fetchUrl, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(postBody),
  });
}

export function getHostName() {
  return process.env.NEXT_PUBLIC_API_SERVER;
}
