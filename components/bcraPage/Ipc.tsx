import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Ipc = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>IPC</CardTitle>
        <CardDescription>
          Change your password here. After saving, you&apos;ll be logged out.
        </CardDescription>
      </CardHeader>
      {/* <CardContent className='grid gap-6'>
      <div className='grid gap-3'>
        <Label htmlFor='tabs-demo-current'>Current password</Label>
        <Input id='tabs-demo-current' type='password' />
      </div>
      <div className='grid gap-3'>
        <Label htmlFor='tabs-demo-new'>New password</Label>
        <Input id='tabs-demo-new' type='password' />
      </div>
    </CardContent>
    <CardFooter>
      <Button>Save password</Button>
    </CardFooter> */}
    </Card>
  );
};

export { Ipc };
