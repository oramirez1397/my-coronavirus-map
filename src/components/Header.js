import React from 'react';
import { Link } from 'gatsby';
import { FaGithub } from 'react-icons/fa';

import { useSiteMetadata } from 'hooks';

import Container from 'components/Container';

const Header = () => {
  const { companyName, companyUrl } = useSiteMetadata();

  return (
    <header>
      <Container type="content">
        <p>
          <Link to="/">C-Unit Covid Tracking</Link>
        </p>
        <ul>
          <li>
            <Link to="/countries/">Global Tracker</Link>
            
          </li>
          <li>
          <Link to="http://localhost:8000/">County Tracker</Link>
          </li>
          <li>
            <a href={companyUrl}>
              <span className="visually-hidden">Github</span>
              <FaGithub />
            </a>
          </li>
        </ul>
      </Container>
    </header>
  );
};

export default Header;
