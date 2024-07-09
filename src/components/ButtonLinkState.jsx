import { Link } from 'react-router-dom';

const ButtonLinkState = ({ clase, destino, estado, children }) => {
  return (
    <Link to={destino} state={estado} className={clase}>
      {children}
    </Link>
  );
};

export default ButtonLinkState;
