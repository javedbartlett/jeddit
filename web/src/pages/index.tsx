import { Button } from '@chakra-ui/core'
import { withUrqlClient } from 'next-urql';
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { NavBar } from '../components/NavBar'
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [{data}] = usePostsQuery()
  return (
    <>
      <NavBar />
      {!data ? (
        <div>Loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
