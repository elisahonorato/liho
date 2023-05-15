import React from 'react'
import { AppBar, Toolbar, Typography, Link, Divider, Box } from '@mui/material'
import theme from '../theme/theme'
import headerItems from './HeaderItems'


export default function Header() {
  return (
    <>
      <AppBar position="sticky" color="primary" elevation={0}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Link href="/">
              <img src={process.env.PUBLIC_URL + '/logo_liho.png'} alt="Logo" height="60" />
            </Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexShrink: 1 }}>
            {headerItems.map((d, i) => {
              return (
                <Typography key={'item' + i} sx={{ ml: 4 }}>
                  <Link href={d.href} sx={{ color: theme.palette.primary.dark }}>{d.label}</Link>
                </Typography>
              )
            })}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  )
}
