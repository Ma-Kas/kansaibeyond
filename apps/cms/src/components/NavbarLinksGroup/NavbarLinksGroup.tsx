import { useState } from 'react';
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  UnstyledButton,
  rem,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import classes from './NavbarLinksGroup.module.css';

interface LinksGroupProps {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  link?: string;
}

const NavbarLinksGroup = ({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  link,
}: LinksGroupProps) => {
  const navigate = useNavigate();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map((link) => (
    <Link className={classes.link} to={link.link} key={link.label}>
      {link.label}
    </Link>
  ));

  return (
    <>
      <UnstyledButton
        onClick={link ? () => navigate(link) : () => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group justify='space-between' gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant='light' size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml='md'>{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? 'rotate(-90deg)' : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
};

export default NavbarLinksGroup;
