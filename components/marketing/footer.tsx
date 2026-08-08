import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">

      <div className="mx-auto max-w-7xl px-8 py-16">

        <div className="grid gap-12 md:grid-cols-4">


          <div className="md:col-span-2">

            <h2 className="text-3xl font-bold">
              Aurora Mobility
            </h2>

            <p className="mt-4 max-w-md text-muted-foreground">
              Making premium electric vehicle ownership more accessible
              through a transparent and modern ownership experience.
            </p>

          </div>



          <div>

            <h3 className="font-semibold">
              Explore
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">

              <li>
                <Link
                  href="/vehicles"
                  className="hover:text-primary"
                >
                  Vehicles
                </Link>
              </li>

              <li>
                <Link
                  href="/compare"
                  className="hover:text-primary"
                >
                  Compare
                </Link>
              </li>

              <li>
                <Link
                  href="/ownership"
                  className="hover:text-primary"
                >
                  Ownership
                </Link>
              </li>

            </ul>

          </div>



          <div>

            <h3 className="font-semibold">
              Company
            </h3>


            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">

              <li>
                <Link
                  href="/about"
                  className="hover:text-primary"
                >
                  About
                </Link>
              </li>


              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary"
                >
                  Contact
                </Link>
              </li>


              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary"
                >
                  FAQ
                </Link>
              </li>

            </ul>


          </div>


        </div>



        <div className="mt-16 border-t pt-8 text-sm text-muted-foreground">

          © {new Date().getFullYear()} Aurora Mobility. All rights reserved.

        </div>


      </div>


    </footer>
  );
}