def scan(domain: str):
    import requests
    from bs4 import BeautifulSoup
    import os
    import urllib.parse
    
    """
    下載指定網域的所有 JavaScript 檔案 () only that url, and only internal js files can be trigger by the url    
    參數:
        domain: 要下載 JS 檔案的網域 (例如 'example.com')
    """
    # 確保網域格式正確
    if not domain.startswith('http'):
        url = f'https://{domain}'
    else:
        url = domain
    # 建立儲存檔案的資料夾
    domain_name = urllib.parse.urlparse(url).netloc
    if url.startswith('https://'):
        prefix = "https://" + domain_name
    else:
        prefix = "http://" + domain_name
    output_dir = f'./scan_queue/'
    os.makedirs(output_dir, exist_ok=True)
    print(f'開始從 {url} 下載 JavaScript 檔案...')
    try:
        # 發送 HTTP 請求獲取網頁內容
        response = requests.get(url)
        response.raise_for_status()  # 如果請求失敗則拋出例外
        # 解析 HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        # 找出所有的 script 標籤
        script_tags = soup.find_all('script')
        # 用來追蹤已下載的檔案數量
        downloaded_count = 0
        # 遍歷所有 script 標籤
        for i, script in enumerate(script_tags):
            src = script.get('src')
            # 只處理有 src 屬性的 script 標籤
            if src:
                print(src)
                # 處理相對路徑和絕對路徑
                if src.startswith('//'):
                    js_url = f'https:{src}'
                elif src.startswith('/'):
                    js_url = f'{prefix}{src}'
                elif not src.startswith(('http://', 'https://')):
                    js_url = f'{prefix}/{src}'
                else:
                    js_url = src
                # 確保只下載指定網域的 JS 檔案
                js_domain = urllib.parse.urlparse(js_url).netloc
                
                if domain_name in js_domain:
                    try:
                        # 下載 JS 檔案
                        js_response = requests.get(js_url)
                        print(f'正在下載: {js_url}')
                        print(js_response)
                        js_response.raise_for_status()
                        # 從 URL 中取得檔案名稱，若沒有則使用索引
                        filename = os.path.basename(urllib.parse.urlparse(js_url).path)
                        if not filename or not filename.endswith('.js'):
                            filename = f'script_{i}.js'
                        # 儲存檔案
                        file_path = os.path.join(output_dir, filename)
                        with open(file_path, 'wb') as f:
                            f.write(js_response.content)
                        print(f'已下載: {filename}')
                        downloaded_count += 1
                    except Exception as e:
                        print(f'下載 {js_url} 時發生錯誤: {e}')
        print(f'完成！共下載了 {downloaded_count} 個 JavaScript 檔案到 {output_dir} 資料夾。')
    except Exception as e:
        print(f'發生錯誤: {e}')