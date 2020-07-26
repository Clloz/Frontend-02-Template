### 学习笔记
本周的学习内容比较多，主要分为两大块。第一部分是状态机第二部分是网络协议和`toy-browser`的实现。

### 状态机和kmp算法
本周的第一部分是实现 `toy-browser` 的前置知识：状态机。课内讲的状态机内容不算复杂，我的主要精力都放在了可选作业中的 `kmp` 算法上。网上能找到的大部分都是基于部分匹配表`PMT`的实现，基于状态机`DFM`的实现比较少。最后是去阅读了`《algorithms 4th edition》`和 `Robert Sedgewick`关于`kmp`算法的视频才搞懂了用状态机的实现。写了一篇状态机和`kmp`算法的博客。
1. [状态机和KMP算法](https://www.clloz.com/programming/front-end/js/2020/07/24/fsm-kmp/)

### HTTP协议和toy-browser的实现
本周的主要内容是理解`HTTP`协议，以及通过`toy-browser`的实现来理解浏览器在收到服务器返回的`HTTP`报文是如何对内容进行解析的。这部分内容同时也是对状态机的应用。由于在 `KMP` 算法上花了很多时间，`toy-browser` 的内容还没有完全消化（只是把程序跑通，有一些解析的细节还没有完全搞清楚）。最后复习了之前阅读 `《图解HTTP》` 时写了两篇关于计算机网络基础的博客。
1. [前端网络基础和HTTP](https://www.clloz.com/programming/network/2019/05/02/http/#OSI_TCPIP)
2. [HTTPS](https://www.clloz.com/programming/network/2019/05/02/https/)

### 总结
本周的内容比较多，进度有点没跟上，一些细节还需要后面花时间掌握。不过对 `KMP` 算法的研究还是有不少收获的。
