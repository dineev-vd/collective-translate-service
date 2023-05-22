import { Link, LinkProps, useMatch, useResolvedPath } from "react-router-dom";
import "./TabLink.css"

const TabLink: React.FC<LinkProps> = ({ children, to, ...props }) => {
    const resolved = useResolvedPath(to);
    const match = useMatch({ path: resolved.pathname, end: false })

    return <div className={`tab-link${match ? "__active" : ""}`}>
        <Link
            to={to}
            {...props}>
            {children}
        </Link>
    </div>
}

export default TabLink;