interface PageHeaderProps {
  title: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => <h1 className="text-3xl">{title}</h1>

export default PageHeader
