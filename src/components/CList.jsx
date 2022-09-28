import { styled } from '@mui/material/styles';
import { List } from '@mui/material';

const CList = styled(List)(({theme}) => `
    margin-top: 3,
    min-width: 300px;
    width: 500px;
    max-width: 90%;
    border-radius: 8px;
    // background-color: ${theme.palette.mode === 'dark' && theme.palette.grey[900]};
    // background-color: ${theme.palette.mode === 'dark' && theme.palette.background.paper};
    // box-shadow: 0px 4px 10px 7px rgba(126, 87, 194, 0.2);
    box-shadow: 0px 7px 8px -4px rgba(126, 87, 194, 0.2),
                0px 12px 17px 2px rgba(126, 87, 194, 0.14),
                0px 5px 22px 4px rgba(126, 87, 194, 0.12);
`)

export default CList;