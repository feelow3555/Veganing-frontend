import { Outlet } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ScrollToTop from "../ScrollToTop";

const RootLayout = () => {
    return (
        <>
            <ScrollToTop />
            <Layout>
                <Outlet />
            </Layout>
        </>
    );
};

export default RootLayout;