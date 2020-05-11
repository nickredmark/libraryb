import "../styles/index.css";
import Head from "next/head";
import { useState } from "react";
import {
  Close,
  Burger,
  SubNav,
  NavItem,
  MobileNav,
  MobileNavItem,
} from "../components/navigation";

export default function MyApp({ Component, pageProps, router }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <Nav route={router.route} />
      <Component {...pageProps} />
    </>
  );
}

const Nav = ({ route }) => {
  const [showMobileNav, setShowMobileNav] = useState(false);
  return (
    <div className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="lg:w-0 lg:flex-1">
            <a href="#" className="flex">
              Game B Library
            </a>
          </div>
          <Burger onClick={() => setShowMobileNav(true)} />
          <SubNav>
            <NavItem active={route === "/"} href="/">
              Home
            </NavItem>
          </SubNav>
        </div>
      </div>
      {showMobileNav && (
        <MobileNav setShow={setShowMobileNav}>
          <MobileNavItem href="/">Home</MobileNavItem>
        </MobileNav>
      )}
    </div>
  );
};
