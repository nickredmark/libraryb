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
    <div className="relative bg-white shadow z-10">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="lg:w-0 lg:flex-1">
            <a href="/" className="flex text-black text-lg">
              Game B Library
            </a>
          </div>
          <Burger onClick={() => setShowMobileNav(true)} />
          <SubNav>
            <NavItem active={route === "/"} href="/">
              Home
            </NavItem>
            <NavItem active={route === "/glossary"} href="/glossary">
              Glossary
            </NavItem>
            <NavItem active={route === "/search"} href="/search">
              Search
            </NavItem>
            <NavItem active={route === "/about"} href="/about">
              About
            </NavItem>
          </SubNav>
        </div>
      </div>
      {showMobileNav && (
        <MobileNav show={showMobileNav} setShow={setShowMobileNav}>
          <MobileNavItem href="/">Home</MobileNavItem>
          <MobileNavItem href="/glossary">Glossary</MobileNavItem>
          <MobileNavItem href="/search">Search</MobileNavItem>
          <MobileNavItem href="/about">About</MobileNavItem>
        </MobileNav>
      )}
    </div>
  );
};
