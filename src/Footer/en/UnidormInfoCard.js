import { Link } from "react-router-dom";

const UnidormInfoCard = (props) => {
  return (
    <div className="unidormCard">
      <h2>{props.title}</h2>
      {props.links.map((link, i) => (
        <Link to={link.linkHref} target={link.blank ? "_blank" : ""} key={i}>
          {link.linkTxT}
        </Link>
      ))}
    </div>
  );
};

export default UnidormInfoCard;
