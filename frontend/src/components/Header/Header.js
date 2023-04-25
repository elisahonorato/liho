import React from 'react'
import { AppBar, Toolbar, Typography, Link, Divider } from '@mui/material'


export default function Header({ menuItems }) {
  return (
    <>
      <AppBar position="sticky" color="primary" elevation={0}>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Link href="/">
            <img src={process.env.PUBLIC_URL + '/logo_liho.png'} alt="Logo" height="60" />
          </Link>
          <div>
            {menuItems.map((d, i) => {
              return (
                <Typography key={'item' + i} variant="subtitle1" sx={{ display: 'inline-block', ml: 2 }}>
                  <Link href={d.href}>{d.label}</Link>
                </Typography>
              )
            })}
          </div>
        </Toolbar>
      </AppBar>
      <Divider variant="middle" />
    </>
  )
}
