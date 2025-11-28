import './globals.css'
import React from 'react'


export const metadata = {
title: 'Server Actions Shop',
description: 'Minimal shop built with Next.js Server Actions'
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
<header style={{ padding: 20, borderBottom: '1px solid #eee' }}>
<h1>Server-Actions Shop</h1>
</header>
<main style={{ padding: 20 }}>{children}</main>
</body>
</html>
)
}