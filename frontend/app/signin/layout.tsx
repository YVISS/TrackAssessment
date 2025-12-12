import Navbar from '../component/navbar/page'

export default function layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <section className='bg-red-100'>
        {children}

      </section>
    </>
  );
}