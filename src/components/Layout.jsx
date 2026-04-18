import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children, user, setUser }) => {
    return (
        <>
        <Header user={user} setUser={setUser} />
        <main>{children}</main>
        <Footer />
        </>
    );
}

export default Layout;