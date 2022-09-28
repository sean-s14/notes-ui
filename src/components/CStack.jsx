import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

const CStack = styled(Stack)( ({ theme }) => `
    width: 18rem;

    & > button, & > div {
        width: 100%;
        color: ${theme.palette.primary.contrastText};
        font-size: 1rem;
    }

    & > button > input, & > div > input {
        font-size: 1.3rem;
    }

    & button a, & div a {
        color: inherit;
        font-size: inherit;
        text-decoration: none;
    }
  `,
);

export default CStack;