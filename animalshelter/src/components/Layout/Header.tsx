import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const items = [
	{ key: 'home', label: <Link to='/'>Главная</Link> },
	{ key: 'animals', label: <Link to='/animals'>Животные</Link> },
];

const AppHeader: React.FC = () => {
	return (
		<Header>
			<Menu
				theme='dark'
				mode='horizontal'
				items={items}
				style={{ flex: 1, minWidth: 0 }}
			/>
		</Header>
	);
};

export default AppHeader;