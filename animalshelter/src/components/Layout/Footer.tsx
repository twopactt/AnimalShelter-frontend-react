import React from 'react';
import { Layout } from 'antd';
import styles from './Layout.module.css';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
	return (
		<Footer className={styles.footer}>
			Animal Shelter ©{new Date().getFullYear()} Created by Artem
		</Footer>
	);
};

export default AppFooter;