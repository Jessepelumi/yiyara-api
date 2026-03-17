const BACKEND_URL = process.env.BASE_URL!;

async function handler(req: Request, path: string[]) {
  const url = `${BACKEND_URL}/${path.filter(Boolean).join("/")}/`;

  console.log("Proxying to:", url);

  const response = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.get("authorization") || "",
    },
    body: req.method !== "GET" ? await req.text() : undefined,
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return handler(req, resolvedParams.path);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  return handler(req, resolvedParams.path);
}
