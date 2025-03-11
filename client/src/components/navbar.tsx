import { Link, useLocation } from "wouter";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center space-x-4">
          <Link href="/">
            <a className={`text-sm font-medium transition-colors hover:text-primary ${
              location === "/" ? "text-primary" : "text-muted-foreground"
            }`}>
              Trang chủ
            </a>
          </Link>
          <Link href="/admin">
            <a className={`text-sm font-medium transition-colors hover:text-primary ${
              location === "/admin" ? "text-primary" : "text-muted-foreground"
            }`}>
              Quản lý đăng ký
            </a>
          </Link>
          <Link href="/dashboard">
            <a className={`text-sm font-medium transition-colors hover:text-primary ${
              location === "/dashboard" ? "text-primary" : "text-muted-foreground"
            }`}>
              Thống kê
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
