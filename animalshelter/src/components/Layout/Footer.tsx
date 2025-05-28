import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
	return (
		<Footer style={{ textAlign: 'center' }}>
			Animal Shelter ©{new Date().getFullYear()} Created by Artem
		</Footer>
	);
};

export default AppFooter;