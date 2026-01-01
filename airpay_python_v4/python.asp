<!doctype html>
<html lang="en">
  <head>
      <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
<link href="/assets/css/chilkatBs.css" rel="stylesheet">

<title>Chilkat Python Module (CkPython)</title>
<META NAME="KEYWORDS" Content="python, chilkat, module, email, zip, encryption, compression">
<meta name="DESCRIPTION" content="Chilkat Python Module">
<link rel="stylesheet" type="text/css" href="/assets/css/bs_download.css" />
<link rel="stylesheet" type="text/css" href="/assets/css/bs_table.css" />

  </head>
  <body>
  



<nav class="navbar navbar-expand-lg navbar-light bg-white">
  <a class="navbar-brand mr-0 mr-md-2" href="/" aria-label="Chilkat Software"><img src="/images/logoNew.jpg" />
</a>


    
    
    
    
    
    
      <div class="navbar-nav-scroll">
    <ul class="navbar-nav flex-row">
    
      <li class="nav-item dropdown active">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Documentation
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="https://www.chilkatsoft.com/readme.asp">ReadMe</a>
          <a class="dropdown-item" href="https://www.chilkatsoft.com/reference.asp">Reference Documentation</a>
          <a class="dropdown-item" href="http://cknotes.com/category/release-notes/">Release Notes</a>
          <a class="dropdown-item" href="https://www.chilkatsoft.com/testimonials.asp">Testimonials</a>
        </div>
      </li>
    
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Licensing
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="https://www.chilkatsoft.com/licensingExplained.asp">About Licensing</a>
          <a class="dropdown-item" href="https://www.chilkatsoft.com/TrialInfo.asp">30-Day Trial</a>
        </div>
      </li>

      <li class="nav-item">
        <a class="nav-link" href="http://cknotes.com/">Blog</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="https://tools.chilkat.io/">Online Tools</a>
      </li>
    </ul>
  </div>
  

    
    
    
    
    
    
    
      <ul class="navbar-nav flex-row ml-md-auto d-none d-md-flex">

<li class="nav-item">
<a href="https://www.chilkatsoft.com/purchase.cshtml"><img src="/images/cart-76-32.gif" /></a>
</li>
    <li class="nav-item">
      <a class="nav-link p-2" href="https://github.com/chilkatsoft" target="_blank" rel="noopener" aria-label="GitHub"><svg class="navbar-nav-svg" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 499.36" focusable="false"><title>GitHub</title><path d="M256 0C114.64 0 0 114.61 0 256c0 113.09 73.34 209 175.08 242.9 12.8 2.35 17.47-5.56 17.47-12.34 0-6.08-.22-22.18-.35-43.54-71.2 15.49-86.2-34.34-86.2-34.34-11.64-29.57-28.42-37.45-28.42-37.45-23.27-15.84 1.73-15.55 1.73-15.55 25.69 1.81 39.21 26.38 39.21 26.38 22.84 39.12 59.92 27.82 74.5 21.27 2.33-16.54 8.94-27.82 16.25-34.22-56.84-6.43-116.6-28.43-116.6-126.49 0-27.95 10-50.8 26.35-68.69-2.63-6.48-11.42-32.5 2.51-67.75 0 0 21.49-6.88 70.4 26.24a242.65 242.65 0 0 1 128.18 0c48.87-33.13 70.33-26.24 70.33-26.24 14 35.25 5.18 61.27 2.55 67.75 16.41 17.9 26.31 40.75 26.31 68.69 0 98.35-59.85 120-116.88 126.32 9.19 7.9 17.38 23.53 17.38 47.41 0 34.22-.31 61.83-.31 70.23 0 6.85 4.61 14.81 17.6 12.31C438.72 464.97 512 369.08 512 256.02 512 114.62 397.37 0 256 0z" fill="currentColor" fill-rule="evenodd"/></svg>
</a>
    </li>
    <li class="nav-item">
      <a class="nav-link p-2" href="https://twitter.com/chilkatsoft" target="_blank" rel="noopener" aria-label="Twitter"><svg class="navbar-nav-svg" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 416.32" focusable="false"><title>Twitter</title><path d="M160.83 416.32c193.2 0 298.92-160.22 298.92-298.92 0-4.51 0-9-.2-13.52A214 214 0 0 0 512 49.38a212.93 212.93 0 0 1-60.44 16.6 105.7 105.7 0 0 0 46.3-58.19 209 209 0 0 1-66.79 25.37 105.09 105.09 0 0 0-181.73 71.91 116.12 116.12 0 0 0 2.66 24c-87.28-4.3-164.73-46.3-216.56-109.82A105.48 105.48 0 0 0 68 159.6a106.27 106.27 0 0 1-47.53-13.11v1.43a105.28 105.28 0 0 0 84.21 103.06 105.67 105.67 0 0 1-47.33 1.84 105.06 105.06 0 0 0 98.14 72.94A210.72 210.72 0 0 1 25 370.84a202.17 202.17 0 0 1-25-1.43 298.85 298.85 0 0 0 160.83 46.92" fill="currentColor"/></svg>
</a>
    </li>

  </ul>
    <a class="btn btn-bd-download d-none d-lg-inline-block mb-3 mb-md-0 ml-md-3" href="/downloads.asp">Downloads</a>
    
  </div>
</nav>    <div class="container-fluid">
      <div class="row flex-xl-nowrap">
  
<!-- use "col-md-3" and "col-xl-2" for a wider left column... -->
  <div class="col-12 col-md-3 col-xl-2 bd-sidebar">

<nav class="bd-links" id="bd-docs-nav">
<div class="bd-toc-item">
  <a class="nav-link" href="https://www.chilkatsoft.com/downloads.asp">Downloads</a>
  <a class="nav-link" href="https://www.chilkatsoft.com/products.asp">Products</a>
  <a class="nav-link" href="https://www.chilkatsoft.com/corporate.asp">Company</a>
  <a class="nav-link active" href="https://www.example-code.com/">Examples</a>
  <a class="nav-link" href="https://www.chilkatsoft.com/help.asp">Help</a>
  <a class="nav-link" href="https://www.chilkatsoft.com/purchase"><img src="/images/cart-76-24.gif" /> Buy</a>
  <a class="nav-link" href="https://twitter.com/chilkatsoft"><img src="/images/twitterLogo.png" width="45" height="37"/> Twitter</a>
</div>
</nav>
</div>


<main class="col-12 col-md-9 col-xl-8 py-md-3 pl-md-5 bd-content" role="main">
<h1 id="download">Chilkat Module for Python (CkPython)</h1>
<p>
<a href="#winDownloads">Windows Downloads</a> <br />
<a href="#linuxDownloads">Linux x86/x86_64 Downloads</a>  <br />
<a href="#linuxArmDownloads">Linux armhf/aarch64 Downloads</a>  <br />
<a href="#alpineDownloads">Alpine Linux x86/x86_64 Downloads</a>  <br />
<a href="#alpineArmDownloads">Alpine Linux armhf Downloads</a>  <br />
<a href="#macDownloads">MAC OS X Downloads</a>  <br />
<a href="#solarisDownloads">Solaris Downloads</a>
</p>
<p class="text-secondary">* For Raspberry Pi 2/3, use Linux armhf/aarch64 downloads.</p>
<p class="text-secondary">* See <a href="http://cknotes.com/ckpython-vs-chilkat2-python/">Chilkat2 Python vs CkPython</a> for information about the differences between the two flavors of Chilkat Python API's.

<a name="winDownloads"></a>
<hr noshade size="1">
<h2 id="download">Windows Downloads</h2>
<blockquote>
<p><a href="installWinPython.asp">Windows Install Instructions</a></p>
<p><b>Note:</b> Python may run as a 32-bit process even on a 64-bit computer.  If this is the case, then download the 32-bit build.</p>
<table class="tecspec">
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">04-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">02c7f157d2914981a78de49c7c75c2880a204f45bb9179126b3b1212a2ab5abe</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.12-x64.zip" title="Chilkat for Python 3.12 64-bit"> Chilkat for Python 3.12 64-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">04-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">5bf42c7152a53909fa3bdc976072d7e6d1a2255d4e5ab16bb264ab68a05d0350</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.12-win32.zip" title="Chilkat for Python 3.12 32-bit"> Chilkat for Python 3.12 32-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">f775add4dc33c5a44ca0ace20964a62a8b8e9124d4329844e073ac53e567b35f</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.11-x64.zip" title="Chilkat for Python 3.11 64-bit"> Chilkat for Python 3.11 64-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">ffb0f0e0cc35819a14210bdc3ba060d3895b9ac8d41dbab8f38204d299292e8d</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.11-win32.zip" title="Chilkat for Python 3.11 32-bit"> Chilkat for Python 3.11 32-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">530cffacedddc7f6b16544c0cb088ef0715e77dc1a262427a61de9d0bc6f2d28</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.10-x64.zip" title="Chilkat for Python 3.10 64-bit"> Chilkat for Python 3.10 64-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">bc0d14507414d850f4bcb748189879f72d9e9617a3a6f634e09a2e83ed59fb73</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.10-win32.zip" title="Chilkat for Python 3.10 32-bit"> Chilkat for Python 3.10 32-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">a5ab12be11fd827be2b458eb22703df787504be198716888140b8a3819785d53</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.9-x64.zip" title="Chilkat for Python 3.9 64-bit"> Chilkat for Python 3.9 64-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">737d88a7cbe42fce1015fa55d34463411bfbdbafbd426639269d0003c81161c3</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.9-win32.zip" title="Chilkat for Python 3.9 32-bit"> Chilkat for Python 3.9 32-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">d183effb393f163f89ce4bb6773841feeec9901cea03d60f718edd2fd236c11c</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.8-x64.zip" title="Chilkat for Python 3.8 64-bit"> Chilkat for Python 3.8 64-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">d73f5ec1b26f2dc220d60d69a8145274123c28cfbc7030c5b94674be300ccb42</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.8-win32.zip" title="Chilkat for Python 3.8 32-bit"> Chilkat for Python 3.8 32-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">a1614f2baa8e57adebb9672bcc8ec6497067f26e0835602aa0a1d04b9623d311</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.7-x64.zip" title="Chilkat for Python 3.7 64-bit"> Chilkat for Python 3.7 64-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">77f87c80d2138f8c063e1b21b5019a50d0eb15904230c436cf2575231f714ce3</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.7-win32.zip" title="Chilkat for Python 3.7 32-bit"> Chilkat for Python 3.7 32-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">521a6a7d2c390369f5c4adf34b6f9380d47d59c825a626108ee34dda4dac00af</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.6-x64.zip" title="Chilkat for Python 3.6 64-bit"> Chilkat for Python 3.6 64-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">a3cabcd62ead1d5b4af9d6e799c49005d9e5fff79ae9015bfa0947f70f547608</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.6-win32.zip" title="Chilkat for Python 3.6 32-bit"> Chilkat for Python 3.6 32-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">fdbf7a5ba09b8d2aa1a6590485dc174fb301c79379048d25ed7159420799c709</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.5-x64.zip" title="Chilkat for Python 3.5 64-bit"> Chilkat for Python 3.5 64-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">fd48ff3ed16e6cf7e05573c945937d0bef46fa78afa294dbe9a58899f8ff67aa</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.5-win32.zip" title="Chilkat for Python 3.5 32-bit"> Chilkat for Python 3.5 32-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">45f7c200e745b9ce1e52c84bd197189e44b716d62ca8708c53b1adf940860651</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.4-x64.zip" title="Chilkat for Python 3.4 64-bit"> Chilkat for Python 3.4 64-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">1429ed96dd11647ee32d11c3141b5160111bf6459c4bfcf16f390c624c5604f2</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.4-win32.zip" title="Chilkat for Python 3.4 32-bit"> Chilkat for Python 3.4 32-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">8e32101043340f5bb64a2c970dd2989ebb5ac4a70c72b1010a2914737156d4c3</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.3-x64.zip" title="Chilkat for Python 3.3 64-bit"> Chilkat for Python 3.3 64-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">a537ed938010aa204ac2eb99cc1a1c4e62e6fb86afe87ea2e773b69dcaeee69a</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.3-win32.zip" title="Chilkat for Python 3.3 32-bit"> Chilkat for Python 3.3 32-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">d592add11591abdb93a067c347c00fc19072c28e619537a956b7f985b0a8afb1</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.2-x64.zip" title="Chilkat for Python 3.2 64-bit"> Chilkat for Python 3.2 64-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">87348f6eeb58aa268cb83a789ee52309ef8132a8d38246cc789adebefbb7757b</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.2-win32.zip" title="Chilkat for Python 3.2 32-bit"> Chilkat for Python 3.2 32-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">3449244772c9bac956340a3eda2c1d1235bcc9de20744295b8b8ace1cb4226e0</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.1-x64.zip" title="Chilkat for Python 3.1 64-bit"> Chilkat for Python 3.1 64-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">2d3bd951383ae6b8fe7c604215a9d531147a366488d317594bbc7beba6a5c35b</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.1-win32.zip" title="Chilkat for Python 3.1 32-bit"> Chilkat for Python 3.1 32-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">3048104e88c452a44d9cccb54df41be62de83b2aebde2cd624e30402d5035046</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.7-x64.zip" title="Chilkat for Python 2.7 64-bit"> Chilkat for Python 2.7 64-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">27463f20b36618da401a4dacdd9ed9c8d313a9232801c21339be6a0b46744c5d</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.7-win32.zip" title="Chilkat for Python 2.7 32-bit"> Chilkat for Python 2.7 32-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">a31b6edd971ebbf5cdd8192efb82e1766be7e1a907c2e69891e7e576b5db6664</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.6-x64.zip" title="Chilkat for Python 2.6 64-bit"> Chilkat for Python 2.6 64-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">b9b07b3753cbc34ec45af260492d3334c09aa4b4b80d9b3efd4bf94fdee9e75d</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.6-win32.zip" title="Chilkat for Python 2.6 32-bit"> Chilkat for Python 2.6 32-bit</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">7268e3c78fbd84d6f850582e93466e0a531217cf65ad6953aeccbcab0affd0db</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.5-win32.zip" title="Chilkat for Python 2.5 32-bit"> Chilkat for Python 2.5 32-bit</a></p>
</td></tr>
 
</table>
</blockquote>



<a name="linuxDownloads"></a>
<hr noshade size="1">
<h2 id="download">Linux x86/x86_64 Downloads</h2>
<blockquote>
<p>(<a href="installPythonLinux.asp">Linux Install Instructions</a>)</p>
<p>(Alpine Linux downloads are located further down on this page...)</p>
<table class="tecspec">
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">02-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">2f596f55ff56958f98fe3e708f985037bbe4b552d3f9f038953b69952b191ba4</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.12-x86_64-linux.tar.gz" title="Chilkat for Python 3.12 64-bit Linux"> Chilkat for Python 3.12 64-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">02-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">c8d60c1c5978cab648dd6dddc772db9cbf27701193f6d7f1f7989e1ac55c9a8d</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.12-x86-linux.tar.gz" title="Chilkat for Python 3.12 32-bit Linux"> Chilkat for Python 3.12 32-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">0acda7c1c7050c64aae6608a1de588a2b14af457f120dc61416f5721c65ea506</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.11-x86_64-linux.tar.gz" title="Chilkat for Python 3.11 64-bit Linux"> Chilkat for Python 3.11 64-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">cd92a0877ca3e0560db1a7dd1eaaa334b2e95d7d010edcea70a426427506ca52</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.11-x86-linux.tar.gz" title="Chilkat for Python 3.11 32-bit Linux"> Chilkat for Python 3.11 32-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">f106c344ecacf918f617c5e2ecf4473b508babdfff42e0af729b0a3e8912372d</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.10-x86_64-linux.tar.gz" title="Chilkat for Python 3.10 64-bit Linux"> Chilkat for Python 3.10 64-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">c3d75cdefa77ef060374d1b9eed65a7b2b261b2178ad082e0677ad978f6242d0</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.10-x86-linux.tar.gz" title="Chilkat for Python 3.10 32-bit Linux"> Chilkat for Python 3.10 32-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">3311de4eaacad32a4024e0ba262f1098b93fa524e3da2fdaa400102683597f14</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.9-x86_64-linux.tar.gz" title="Chilkat for Python 3.9 64-bit Linux"> Chilkat for Python 3.9 64-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">9a45f505e036d3751f1b67bfe61139a6d00dd1adc7679c0cea93c75bd10ff18a</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.9-x86-linux.tar.gz" title="Chilkat for Python 3.9 32-bit Linux"> Chilkat for Python 3.9 32-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">7bf74264cbd3dffb8dafc5e9ea15de3687286e962a31630c49ee6e6234cd2487</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.8-x86_64-linux.tar.gz" title="Chilkat for Python 3.8 64-bit Linux"> Chilkat for Python 3.8 64-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">ac551aec3ffa634985e8f312760b1c3ce6ad6209d6cc797353e4b1548006eabd</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.8-x86-linux.tar.gz" title="Chilkat for Python 3.8 32-bit Linux"> Chilkat for Python 3.8 32-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">fd5a9b1f9dbe05550d548e84b8040446e5ccf12f2b507041b09ab252daffe4d2</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.7-x86_64-linux.tar.gz" title="Chilkat for Python 3.7 64-bit Linux"> Chilkat for Python 3.7 64-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">08b700edf3185838865f9a0f3c7a0f4438dcb57f512e710066cfbd14bf20ce6a</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.7-x86-linux.tar.gz" title="Chilkat for Python 3.7 32-bit Linux"> Chilkat for Python 3.7 32-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">db46a747f4ce72764e86ac68854edbcf1263caab0b1784b7ee4d9ba5286135b1</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.6-x86_64-linux.tar.gz" title="Chilkat for Python 3.6 64-bit Linux"> Chilkat for Python 3.6 64-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">2b9caa11a7d5e2ca1f3fdcdc2c9ef4730db42fdbac33ade5068469d81bdac9e7</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.6-x86-linux.tar.gz" title="Chilkat for Python 3.6 32-bit Linux"> Chilkat for Python 3.6 32-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">7cd9b85d42c587e709357f17eb423350948f26f106b98e4d578c2a3ae63d311e</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.5-x86_64-linux.tar.gz" title="Chilkat for Python 3.5 64-bit Linux"> Chilkat for Python 3.5 64-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">65094f31218f618de75dc2b5eaf5c39a0965537e3a44f0971133b0d0058e5402</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.5-x86-linux.tar.gz" title="Chilkat for Python 3.5 32-bit Linux"> Chilkat for Python 3.5 32-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">b628dc217415294d3a306c5ad10fd3ae7e4f9a7f91d091923d719316f756a09c</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.4-x86_64-linux.tar.gz" title="Chilkat for Python 3.4 64-bit Linux"> Chilkat for Python 3.4 64-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">e1b552f019236cb9725c8834b562848be506416f5b14fdd87e08ca5636493719</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.4-x86-linux.tar.gz" title="Chilkat for Python 3.4 32-bit Linux"> Chilkat for Python 3.4 32-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">50cecad8291447966ab919150d6ea1d491dc2f4ba769c38c0ab323de49e316fa</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.3-x86_64-linux.tar.gz" title="Chilkat for Python 3.3 64-bit Linux"> Chilkat for Python 3.3 64-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">46514a180e8d4a74e5965ce3fc7f03c4d8ba51a0512f4ba1c8e55d2acae3feae</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.3-x86-linux.tar.gz" title="Chilkat for Python 3.3 32-bit Linux"> Chilkat for Python 3.3 32-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">1c14087b940df81c6e6bbdd2dc9fc205862417988a99fb9be7999f0415c5e341</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.2-x86_64-linux.tar.gz" title="Chilkat for Python 3.2 64-bit Linux"> Chilkat for Python 3.2 64-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">670bf3c8c229db2649fb50d9ef522bfd3b90a7a17f05bddc045b6c6440f70038</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.2-x86-linux.tar.gz" title="Chilkat for Python 3.2 32-bit Linux"> Chilkat for Python 3.2 32-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">55cf3aebc801ed3d217035a44279290ec443af3413679b903fd43486df81ec2e</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.1-x86_64-linux.tar.gz" title="Chilkat for Python 3.1 64-bit Linux"> Chilkat for Python 3.1 64-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">79c720db94d0378936478b4afd8e67b501fa7c8b7b8eaeef76f26b17f475a658</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.1-x86-linux.tar.gz" title="Chilkat for Python 3.1 32-bit Linux"> Chilkat for Python 3.1 32-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">4413439ae6354394dcfa973f9e6adaf51ba60f5d0576fa0d1db6f2ef9d3df8f2</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.0-x86_64-linux.tar.gz" title="Chilkat for Python 3.0 64-bit Linux"> Chilkat for Python 3.0 64-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">4c44d6ee89c1146f41065e3d9472ee92ac68cb393e547cec30c1755815944fef</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.0-x86-linux.tar.gz" title="Chilkat for Python 3.0 32-bit Linux"> Chilkat for Python 3.0 32-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">4e5a0513f4a2b1fbe5b6e192776b18d3ce5e74bbb5bba42bd8673da45df09267</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.7-x86_64-linux.tar.gz" title="Chilkat for Python 2.7 64-bit Linux"> Chilkat for Python 2.7 64-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">4a7e3a8428587dbcf1eb33a459b4f52f52fcba65fe72e7c370ca8ac2aec86c64</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.7-x86-linux.tar.gz" title="Chilkat for Python 2.7 32-bit Linux"> Chilkat for Python 2.7 32-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">8a42d59cc68a2f0fc37ad4cf4fcfb42277cc3ed26176f81b6a5dcde1e222062c</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.6-x86_64-linux.tar.gz" title="Chilkat for Python 2.6 64-bit Linux"> Chilkat for Python 2.6 64-bit Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">1f13c4465d272fb81d3d1508df18caeb1e4bb91d33ebf3ba1ac9d43d1d5ee62d</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.6-x86-linux.tar.gz" title="Chilkat for Python 2.6 32-bit Linux"> Chilkat for Python 2.6 32-bit Linux</a></p>
</td></tr>
 
</table>
</blockquote>

<a name="linuxArmDownloads"></a>
<hr noshade size="1">
<h2 id="download">Linux armhf/aarch64 Downloads</h2>
<blockquote>
<p>(<a href="installPythonLinux.asp">Linux Install Instructions</a>)</p>
<p>(Alpine Linux downloads are located further down on this page...)</p>
<table class="tecspec">
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">02-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">daed98e186e9b5d6ccacfef1b9f091d85ccaea19b2d04946efcd6e99583bd93f</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.12-armv7l-linux.tar.gz" title="Python 3.12 Module for armhf Linux (armv7l)"> Python 3.12 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">02-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">14e45a5466b5222775aa5538dcc34b62d2bfba40677890e5f04108453ed72854</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.12-aarch64-linux.tar.gz" title="Python 3.12 Module for aarch64 Linux"> Python 3.12 Module for aarch64 Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">c63498ff03c842fadb86234dc8ff084e757970ebcd784d25982498c064302e12</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.11-armv7l-linux.tar.gz" title="Python 3.11 Module for armhf Linux (armv7l)"> Python 3.11 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">4a2a242b9d5ae0af9fd1726bf475bd6947493c72a48e1a1d91d0d6f5f4cfa2a9</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.11-aarch64-linux.tar.gz" title="Python 3.11 Module for aarch64 Linux"> Python 3.11 Module for aarch64 Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">90524ea45c52ac84d953f55bebecb4e33e7fe3ebd1eca5bbe1e12739900f09df</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.10-armv7l-linux.tar.gz" title="Python 3.10 Module for armhf Linux (armv7l)"> Python 3.10 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">badab33715c593f928223ce1d99f11ce962691ee86b31d4f444eeee64056f7c6</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.10-aarch64-linux.tar.gz" title="Python 3.10 Module for aarch64 Linux"> Python 3.10 Module for aarch64 Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">e05fc381c19d6878e63dfce198e423a915e1cb8ef1f5b43d240a3830e7d4377c</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.9-armv7l-linux.tar.gz" title="Python 3.9 Module for armhf Linux (armv7l)"> Python 3.9 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">d6bacda118ae3cc9defa10342d48e59fa5cb0107878025c01adf9c1258f11ba3</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.9-aarch64-linux.tar.gz" title="Python 3.9 Module for aarch64 Linux"> Python 3.9 Module for aarch64 Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">a24580680819e5c634fe95ed2120cbe3f31c3c68e49b52be4396da295f60c60c</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.8-armv7l-linux.tar.gz" title="Python 3.8 Module for armhf Linux (armv7l)"> Python 3.8 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">09ff8c5367df67c7a07d3fa1534711591521ae022ea2f5cfb0c05776f5cb43fe</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.8-aarch64-linux.tar.gz" title="Python 3.8 Module for aarch64 Linux"> Python 3.8 Module for aarch64 Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">45070ac0d81c4e236c91a10d9e710e858f1c7e535b99cd29ac0163e8e98c9387</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.7-armv7l-linux.tar.gz" title="Python 3.7 Module for armhf Linux (armv7l)"> Python 3.7 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">44482d59f0f0e654dc4968c6b38aebafc35daed3265c34b1f27d35f12a48bfe3</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.7-aarch64-linux.tar.gz" title="Python 3.7 Module for aarch64 Linux"> Python 3.7 Module for aarch64 Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">97e1c3891acc5c4c1dace9a7d769d3575d768567a6145ebe3c78147a145ad3ae</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.6-armv7l-linux.tar.gz" title="Python 3.6 Module for armhf Linux (armv7l)"> Python 3.6 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">47f6a757ffc293ff095c16954957ad678235ff384a272e3a385733692b3ad822</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.6-aarch64-linux.tar.gz" title="Python 3.6 Module for aarch64 Linux"> Python 3.6 Module for aarch64 Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">41ec4bf4bb3584ad732a0996b300615223653cbb0f5e95e8eef36bed456cbfe2</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.5-armv7l-linux.tar.gz" title="Python 3.5 Module for armhf Linux (armv7l)"> Python 3.5 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">8a9ccc0f100f879c40b2102ca1fb3942cacbb3a4aa72ad2d1d96a79a73ae67b9</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.5-aarch64-linux.tar.gz" title="Python 3.5 Module for aarch64 Linux"> Python 3.5 Module for aarch64 Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">74954c39f2bf8216b0f033899b66d7aa76b9117b6af80eedc17ec70c4dd68304</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.4-armv7l-linux.tar.gz" title="Python 3.4 Module for armhf Linux (armv7l)"> Python 3.4 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">8eec8945113712b99f78b22cd7a85952ca70435efe8e934f6821d37b2b685682</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.4-aarch64-linux.tar.gz" title="Python 3.4 Module for aarch64 Linux"> Python 3.4 Module for aarch64 Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">3b45a1509867e289e9b978a9d565c852db721a136b480cd6c8762e8d5d39e8c2</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.3-armv7l-linux.tar.gz" title="Python 3.3 Module for armhf Linux (armv7l)"> Python 3.3 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">9f9504e97ad9e1a9d5857d45a3dba7a0e40232f47afd413f0362bff745c05438</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.2-armv7l-ucs4-linux.tar.gz" title="Python 3.2 UCS4 Module for armhf Linux (armv7l)"> Python 3.2 UCS4 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">8deff936de7dbf6453cd9c2bc083e581b395117f4413e1810e042e5e00f38d87</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.2-armv7l-linux.tar.gz" title="Python 3.2 UCS2 Module for armhf Linux (armv7l)"> Python 3.2 UCS2 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">7bec3560ec6780c24852776fdf6b02ec1401f01272d28625e9dd6ea132cdbaf0</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.1-armv7l-ucs4-linux.tar.gz" title="Python 3.1 UCS4 Module for armhf Linux (armv7l)"> Python 3.1 UCS4 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">21bd9964e26d1066d10febbc55ed9c1e9cf30e3373a00cc9f3275e813124e28a</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.1-armv7l-linux.tar.gz" title="Python 3.1 UCS2 Module for armhf Linux (armv7l)"> Python 3.1 UCS2 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">d0923eebd7196b8ab5ac876b768be5d0269902f81489f7b3009815d3d8c2f7b3</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.0-armv7l-ucs4-linux.tar.gz" title="Python 3.0 UCS4 Module for armhf Linux (armv7l)"> Python 3.0 UCS4 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">0e1a5019419d0bbba9aeedebb0daad16eb314760be272cc9b352c5fcb9d50ff1</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.0-armv7l-linux.tar.gz" title="Python 3.0 UCS2 Module for armhf Linux (armv7l)"> Python 3.0 UCS2 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">71891aabf9c22fcbcc8bfcbdc36b093b692f1626cebb217a2598edaa95805ccd</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.7-armv7l-linux.tar.gz" title="Python 2.7 Module for armhf Linux (armv7l)"> Python 2.7 Module for armhf Linux (armv7l)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">9a400c3b6c8b9cd82bf7fa32bcd85d082cee2fe9b120c2649af7371cf5f67219</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.7-aarch64-linux.tar.gz" title="Python 2.7 Module for aarch64 Linux"> Python 2.7 Module for aarch64 Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">55c50357fdef8128441455745596c6026a3bd2b9ec8393f06a90debe7b180cd2</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.6-armv7l-linux.tar.gz" title="Python 2.6 Module for armhf Linux (armv7l)"> Python 2.6 Module for armhf Linux (armv7l)</a></p>
</td></tr>
 
</table>
</blockquote>

<a name="alpineDownloads"></a>
<hr noshade size="1">
<h2 id="download">Alpine Linux x86/x86_64 Downloads</h2>
<blockquote>
<p>(<a href="installPythonLinux.asp">Linux Install Instructions</a>)</p>
<table class="tecspec">
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">02-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">5c21b1f9f52f9a29501c63637b11eb37d04215fa3b9f6231f9567457f7c765a9</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.12-x86-alpine.tar.gz" title="Python 3.12 Module for 32-bit Alpine Linux (x86)"> Python 3.12 Module for 32-bit Alpine Linux (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">02-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">1103ddc95a73dca0f53bca03677a661c58686d6fafae0a2f10a11467f55ee949</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.12-x86_64-alpine.tar.gz" title="Python 3.12 Module for 64-bit Alpine Linux (x86_64)"> Python 3.12 Module for 64-bit Alpine Linux (x86_64)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">2b6e85cef7ae224f31d001480a273a9f02a07a398c84f0867180a3c3334e8088</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.11-x86-alpine.tar.gz" title="Python 3.11 Module for 32-bit Alpine Linux (x86)"> Python 3.11 Module for 32-bit Alpine Linux (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">172a7e3fa9a3fe545d65483456a09f8112b4ec299dbed3c23fc5e71406a71160</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.11-x86_64-alpine.tar.gz" title="Python 3.11 Module for 64-bit Alpine Linux (x86_64)"> Python 3.11 Module for 64-bit Alpine Linux (x86_64)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">542ba8d550dd3b55d23464799c5bbc0e412f25e87805f5b6fceb327c9df0b3ef</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.10-x86-alpine.tar.gz" title="Python 3.10 Module for 32-bit Alpine Linux (x86)"> Python 3.10 Module for 32-bit Alpine Linux (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">c687a70f228d70617f7fe42cc3b3ce241e28cbe84470ee95f859b1578e513388</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.10-x86_64-alpine.tar.gz" title="Python 3.10 Module for 64-bit Alpine Linux (x86_64)"> Python 3.10 Module for 64-bit Alpine Linux (x86_64)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">4dff2b59e2a422d16e706b02dda3bf3c7644606ff8f341bd25b3fa62a3ec144d</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.9-x86-alpine.tar.gz" title="Python 3.9 Module for 32-bit Alpine Linux (x86)"> Python 3.9 Module for 32-bit Alpine Linux (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">c0fab21c06296cc038d6033665361dd8de65bd56a449e9c02b4bde6928304fc1</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.9-x86_64-alpine.tar.gz" title="Python 3.9 Module for 64-bit Alpine Linux (x86_64)"> Python 3.9 Module for 64-bit Alpine Linux (x86_64)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">9d8b687ada63347acf9dd6c040c11dc929edeacfc98796686b3f986f1862d545</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.8-x86-alpine.tar.gz" title="Python 3.8 Module for 32-bit Alpine Linux (x86)"> Python 3.8 Module for 32-bit Alpine Linux (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">e75b04112c30750f53235561e6adb5b4c5c2d1a0332ad61687f08feb35fd6206</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.8-x86_64-alpine.tar.gz" title="Python 3.8 Module for 64-bit Alpine Linux (x86_64)"> Python 3.8 Module for 64-bit Alpine Linux (x86_64)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">88d1cd8bbdca99e603f2652e5da0cc59ec71386e1323b62208cf2373b9a2e560</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.7-x86-alpine.tar.gz" title="Python 3.7 Module for 32-bit Alpine Linux (x86)"> Python 3.7 Module for 32-bit Alpine Linux (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">5f1de5341acf5a2f5c83b5c5353a50c886d816cf0c8d486191fdbfe6c8ffb598</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.7-x86_64-alpine.tar.gz" title="Python 3.7 Module for 64-bit Alpine Linux (x86_64)"> Python 3.7 Module for 64-bit Alpine Linux (x86_64)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">0495bf64285f538b999b7eb2c1b228570812e1b39dbe697a203ec4e3bd5b17e2</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.6-x86-alpine.tar.gz" title="Python 3.6 Module for 32-bit Alpine Linux (x86)"> Python 3.6 Module for 32-bit Alpine Linux (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">02c9222438a895dea4326a3c36536451671d91d3ac5cb67dcdbfd1e5f8604617</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.6-x86_64-alpine.tar.gz" title="Python 3.6 Module for 64-bit Alpine Linux (x86_64)"> Python 3.6 Module for 64-bit Alpine Linux (x86_64)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">6d6e859ff31a60e42c1fb7c326b42c54aa4de02ce66e6d3f68cb96fcdaf23cd6</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.5-x86-alpine.tar.gz" title="Python 3.5 Module for 32-bit Alpine Linux (x86)"> Python 3.5 Module for 32-bit Alpine Linux (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">e3546694da3042f8557d83caaf25f7f50f7f377a5ed6f02cca3ffe4e1769fd89</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.5-x86_64-alpine.tar.gz" title="Python 3.5 Module for 64-bit Alpine Linux (x86_64)"> Python 3.5 Module for 64-bit Alpine Linux (x86_64)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">50398cb94e377b66de46524abc229ba57c1f1c063f47e826d7fcacb3bbc0627b</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.4-x86-alpine.tar.gz" title="Python 3.4 Module for 32-bit Alpine Linux (x86)"> Python 3.4 Module for 32-bit Alpine Linux (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">cfd9f0eeacfd1632404555fd738016799742ed6ccde4b95dc755fe18d0f522a0</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.4-x86_64-alpine.tar.gz" title="Python 3.4 Module for 64-bit Alpine Linux (x86_64)"> Python 3.4 Module for 64-bit Alpine Linux (x86_64)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">8477d6fe93193e080183c49d047e967a963fd00884a35c14b99a745582d4893f</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.7-x86-alpine.tar.gz" title="Python 2.7 Module for 32-bit Alpine Linux (x86)"> Python 2.7 Module for 32-bit Alpine Linux (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">27-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">e6227a7ed72bf0cb486c3438fc88d6240f282a5c27e3bde4d0c336d0ea39c54d</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.7-x86_64-alpine.tar.gz" title="Python 2.7 Module for 64-bit Alpine Linux (x86_64)"> Python 2.7 Module for 64-bit Alpine Linux (x86_64)</a></p>
</td></tr>
 
</table>
</blockquote>

<a name="alpineArmDownloads"></a>
<hr noshade size="1">
<h2 id="download">Alpine Linux armhf Downloads</h2>
<blockquote>
<p>(<a href="installPythonLinux.asp">Linux Install Instructions</a>)</p>
<table class="tecspec">
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">02-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">c4be11b9dabeb72187608dbf5dabcaffaf21892fcd0c1704c2a4e472d6e906c9</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.12-armhf-alpine.tar.gz" title="Python 3.12 Module for armhf Alpine Linux"> Python 3.12 Module for armhf Alpine Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.96</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">29-Oct-2023</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">ac0e1de3e1ef7b45d5cadb169479bfee41d944106d2cc117a5281c1b85f2a2fe</span><br>
<a href="https://chilkatdownload.com/9.5.0.96/chilkat-9.5.0-python-3.11-armhf-alpine.tar.gz" title="Python 3.11 Module for armhf Alpine Linux"> Python 3.11 Module for armhf Alpine Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.96</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">29-Oct-2023</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">237914f5469f27a1d809192ac572db757ba3cd535ea177ab92a1bd71b441193a</span><br>
<a href="https://chilkatdownload.com/9.5.0.96/chilkat-9.5.0-python-3.10-armhf-alpine.tar.gz" title="Python 3.10 Module for armhf Alpine Linux"> Python 3.10 Module for armhf Alpine Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.96</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">29-Oct-2023</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">6852675f217e9e1ba4365cfbf495f67bca5d5fe6fa277c8cec0ec48a0c171e59</span><br>
<a href="https://chilkatdownload.com/9.5.0.96/chilkat-9.5.0-python-3.9-armhf-alpine.tar.gz" title="Python 3.9 Module for armhf Alpine Linux"> Python 3.9 Module for armhf Alpine Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.96</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">29-Oct-2023</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">b93b386d6d17e51ad285e084bf5635a2f16ad4989d5290475db5fc7bc26091e7</span><br>
<a href="https://chilkatdownload.com/9.5.0.96/chilkat-9.5.0-python-3.8-armhf-alpine.tar.gz" title="Python 3.8 Module for armhf Alpine Linux"> Python 3.8 Module for armhf Alpine Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.96</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">29-Oct-2023</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">0cc1f2cd0af5a43dc5a35bb17b5134c30d4fdfe2e4f4aaa461f03c6e872bf280</span><br>
<a href="https://chilkatdownload.com/9.5.0.96/chilkat-9.5.0-python-3.7-armhf-alpine.tar.gz" title="Python 3.7 Module for armhf Alpine Linux"> Python 3.7 Module for armhf Alpine Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.96</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">29-Oct-2023</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">b031ce76e1343203bf68790f116f2a3d582b57d26aca7e35d8d1477a3962a481</span><br>
<a href="https://chilkatdownload.com/9.5.0.96/chilkat-9.5.0-python-3.6-armhf-alpine.tar.gz" title="Python 3.6 Module for armhf Alpine Linux"> Python 3.6 Module for armhf Alpine Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.96</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">29-Oct-2023</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">6f46647504e04ef59711ed550602af189cbe06fd96605a35e85715e2584af898</span><br>
<a href="https://chilkatdownload.com/9.5.0.96/chilkat-9.5.0-python-3.5-armhf-alpine.tar.gz" title="Python 3.5 Module for armhf Alpine Linux"> Python 3.5 Module for armhf Alpine Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.96</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">29-Oct-2023</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">f7ce6cda92e66152ef628cb6d73c6937af25f199003fe5dda8cbb3de7723ef5d</span><br>
<a href="https://chilkatdownload.com/9.5.0.96/chilkat-9.5.0-python-3.4-armhf-alpine.tar.gz" title="Python 3.4 Module for armhf Alpine Linux"> Python 3.4 Module for armhf Alpine Linux</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.96</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">29-Oct-2023</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">5f1f9c2963f5d2e0ef765a7ed78fb02c5a07affc9777e3f07917bd924efba515</span><br>
<a href="https://chilkatdownload.com/9.5.0.96/chilkat-9.5.0-python-2.7-armhf-alpine.tar.gz" title="Python 2.7 Module for armhf Alpine Linux"> Python 2.7 Module for armhf Alpine Linux</a></p>
</td></tr>
 
</table>
</blockquote>


<a name="macDownloads"></a>
<hr noshade size="1">
<h2 id="download">MAC OS X Downloads</h2>
<blockquote>
<p>(<a href="installPythonMacOSX.asp">MAC OS X Install Instructions</a>)</p>

<table class="tecspec">
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">4bd23b3f7c13d876bf7f65b3b3222674de2886d03851b2382a7015b73f62cf56</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.12-x86_64-macosx.tar.gz" title="Python 3.12 Module for x86_64 MacOS"> Python 3.12 Module for x86_64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">89bec1477ad46a8a58bad2706cb506bd5ab6d1eec016bb8935ea84824ff3882c</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.12-arm64-macosx.tar.gz" title="Python 3.12 Module for arm64 MacOS"> Python 3.12 Module for arm64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">5098ae08d6a644ebd6313d0e67d18272258f52ff9dcc11d9584783227cba68c0</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.11-x86_64-macosx.tar.gz" title="Python 3.11 Module for x86_64 MacOS"> Python 3.11 Module for x86_64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">68db2ffdd1b7eaaa2aa81dccd4aa376ff946c60cd20cbb6c26ddb7cbb96c64f9</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.11-arm64-macosx.tar.gz" title="Python 3.11 Module for arm64 MacOS"> Python 3.11 Module for arm64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">7d55d9213cffe10c5c263704477badb79178f4c50ce238c84511638facb8fe73</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.10-x86_64-macosx.tar.gz" title="Python 3.10 Module for x86_64 MacOS"> Python 3.10 Module for x86_64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">8d65502edbd93171fbf8ef0466d926a5ce5137d61e7a87e5870de998fcff36c9</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.10-arm64-macosx.tar.gz" title="Python 3.10 Module for arm64 MacOS"> Python 3.10 Module for arm64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">75d05716cc0badd427ba205b434ccf4d6c8d4ed33bce9572f808fa995c573511</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.9-x86_64-macosx.tar.gz" title="Python 3.9 Module for x86_64 MacOS"> Python 3.9 Module for x86_64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">f008bdcc807258857b55827cb6b11e7a6c04c78c1f4c5a3f3701bd7d9c748ebb</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.9-arm64-macosx.tar.gz" title="Python 3.9 Module for arm64 MacOS"> Python 3.9 Module for arm64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">8efd8cd07d09a557888b536e590ab8ef9c5064e1d7f2f65048eb971d202b1f6a</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.8-x86_64-macosx.tar.gz" title="Python 3.8 Module for x86_64 MacOS"> Python 3.8 Module for x86_64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">9d5d9c75ddd465a8f5a1c776ab95054c0dead9f88fe30af9fa6ec5d38ec56f6b</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.7-x86_64-macosx.tar.gz" title="Python 3.7 Module for x86_64 MacOS"> Python 3.7 Module for x86_64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">27c92821b89bd3889b6b0db06c556c31a6e7d0a134a7efb558095b379d49d5de</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.6-x86_64-macosx.tar.gz" title="Python 3.6 Module for x86_64 MacOS"> Python 3.6 Module for x86_64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">e14c4b10bd58d215518c339f68cb01219a34728e7e4d11a317a5b14d6196092b</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.5-x86_64-macosx.tar.gz" title="Python 3.5 Module for x86_64 MacOS"> Python 3.5 Module for x86_64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">fdb8fdaa3de918af97d75a285fd4ae9fe6e346b34bcaa0908b34fc1baadae609</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.4-x86_64-macosx.tar.gz" title="Python 3.4 Module for x86_64 MacOS"> Python 3.4 Module for x86_64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">6dea676997ce9e6f2e0392f5b24e1e54891cff3951f5a223678318ac81fa407c</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.3-x86_64-macosx.tar.gz" title="Python 3.3 Module for x86_64 MacOS"> Python 3.3 Module for x86_64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">1b80968432970afb0d6141290812011f763aaab8eba6e141deb257a5526e9f11</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.2-x86_64-macosx.tar.gz" title="Python 3.2 Module for x86_64 MacOS"> Python 3.2 Module for x86_64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">3c3d731b9f85096e18de1e89b1a78e4848a24e0f6845a485a53fa5c6534e0065</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.1-x86_64-macosx.tar.gz" title="Python 3.1 Module for x86_64 MacOS"> Python 3.1 Module for x86_64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">269479b313740a7aad49956885567931e5c3604130f81ad95230511bf3cdb85d</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.7-x86_64-macosx.tar.gz" title="Python 2.7 Module for x86_64 MacOS"> Python 2.7 Module for x86_64 MacOS</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">28-Jan-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">0ac70c3c1a4e114c67850d5efa2a43fd171ac8e6cba1a97fa5da82beb8d979d6</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.6-x86_64-macosx.tar.gz" title="Python 2.6 Module for x86_64 MacOS"> Python 2.6 Module for x86_64 MacOS</a></p>
</td></tr>
 


</table>


</blockquote>

<a name="solarisDownloads"></a>
<hr noshade size="1">
<h2 id="download">Solaris Downloads</h2>
<blockquote>
<p>(<a href="installPythonLinux.asp">Install Instructions</a>)</p>

<table class="tecspec">
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">01-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">65a1d0c5d58b176bd5ccd3b5e436f967736bda52942f9c3f3d5799ff1a79ad5a</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.9-x86-solaris.tar.gz" title="Chilkat for 32-bit Python 3.9 Solaris (x86)"> Chilkat for 32-bit Python 3.9 Solaris (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">01-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">92b4035bcf452258de88e0219d0e3eb204936990cbdb717bc3e71a464c83d470</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.8-x86-solaris.tar.gz" title="Chilkat for 32-bit Python 3.8 Solaris (x86)"> Chilkat for 32-bit Python 3.8 Solaris (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">01-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">0af749b97237ff258df5ef003e9c49245d15b48df81a6f333590e201ee992bbe</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.7-x86-solaris.tar.gz" title="Chilkat for 32-bit Python 3.7 Solaris (x86)"> Chilkat for 32-bit Python 3.7 Solaris (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">01-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">6406bbd04528d6f743d9667a0b1299fa33f22801caaadc5c99bf4949dd72cd2c</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.6-x86-solaris.tar.gz" title="Chilkat for 32-bit Python 3.6 Solaris (x86)"> Chilkat for 32-bit Python 3.6 Solaris (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">01-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">49757b8a49ae49ce493058247aecc2beb71bd88ebb8fd6d41abb2722fdea33fa</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.5-x86-solaris.tar.gz" title="Chilkat for 32-bit Python 3.5 Solaris (x86)"> Chilkat for 32-bit Python 3.5 Solaris (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">01-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">915c6a3a81503d226a09c44325ce494a1e2e4b6603b7fa5f6294d6709035b72c</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-3.4-x86-solaris.tar.gz" title="Chilkat for 32-bit Python 3.4 Solaris (x86)"> Chilkat for 32-bit Python 3.4 Solaris (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">01-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">1941bb9f661a653a248fb560082f42b609d6090dc3d14307ab3eec0226e80ff2</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.7-x86-solaris.tar.gz" title="Chilkat for 32-bit Python 2.7 Solaris (x86)"> Chilkat for 32-bit Python 2.7 Solaris (x86)</a></p>
</td></tr>
<tr><td valign="top">
<p class="button"><span id="dwnVer2">v9.5.0.97</span><span id="dwnDot"> &#149; </span>
<span id="dwnDate2">01-Feb-2024</span><span id="dwnDot"> &#149; </span><span id="dwnDate2">sha256: </span><span id="dwnMd5">c86d7a4df398f6fae34087f265d23a1c567a73a94e7d2f1a29eb0b7bc6753556</span><br>
<a href="https://chilkatdownload.com/9.5.0.97/chilkat-9.5.0-python-2.6-x86-solaris.tar.gz" title="Chilkat for 32-bit Python 2.6 Solaris (x86)"> Chilkat for 32-bit Python 2.6 Solaris (x86)</a></p>
</td></tr>
 
</table>
</blockquote>


</main>
      </div>
    </div>
<div align="center" class="col-8 ck-priv-sm">
<b><a class="ck-priv-sm" href="privacy.asp">Privacy Statement.</a></b> Copyright 2000-2022 Chilkat Software, Inc. All rights reserved. <br/> (Regarding the usage of the Android logo) Portions of this page are reproduced from work created and shared by Google and used according to terms <br/> described in the 
  <a class="ck-priv-sm" href="http://creativecommons.org/licenses/by/3.0/"> Creative Commons 3.0 Attribution License</a>.
</div>
<div align="center" class="col-8 ck-priv-md">
  Send feedback to <a class="ck-priv-md" href="mailto:info@chilkatsoft.com">info@chilkatsoft.com</a><br/>Software APIs, modules, components, and libraries for Windows, Linux, MacOS, iOS, Android&#8482;, Alpine Linux, Solaris, MinGW, ...</div>
    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    
  </body>
</html>
