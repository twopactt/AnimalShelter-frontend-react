import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import styles from './Layout.module.css';

const { Header } = Layout;

const items = [
	{ key: 'home', label: <Link to='/'>Главная</Link> },
	{ key: 'animals', label: <Link to='/animals'>Животные</Link> },
];

const AppHeader: React.FC = () => {
	return (
		<Header className={styles.header}>
			<Menu
				className={styles.menu}
				theme='dark'
				mode='horizontal'
				items={items}
			/>
		</Header>
	);
};

export default AppHeader;